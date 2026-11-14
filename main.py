import json
import os
import secrets
import sqlite3
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import psycopg
from psycopg.rows import dict_row
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict

DATABASE_URL = os.environ.get("DATABASE_URL")
DB_PATH = os.environ.get("DB_PATH", "./questsync.db")
API_TOKEN = os.environ.get("QUESTSYNC_TOKEN", "password")

security = HTTPBearer()


def get_pg():
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)


def get_sqlite():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_sql = """
        CREATE TABLE IF NOT EXISTS character_quests (
            character_id BIGINT PRIMARY KEY,
            character_name TEXT NOT NULL,
            quest_data TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """
    if DATABASE_URL:
        with get_pg() as conn:
            conn.execute(create_sql)
    else:
        with get_sqlite() as conn:
            conn.execute(create_sql)
    yield


app = FastAPI(title="CatsEyeXI QuestSync API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not secrets.compare_digest(credentials.credentials, API_TOKEN):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid sync token",
        )


class QuestSyncPayload(BaseModel):
    model_config = ConfigDict(extra="allow")
    character_id: int
    character_name: str


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "CatsEyeXI QuestSync API",
        "storage": "postgres" if DATABASE_URL else "sqlite",
    }


@app.post("/v1/sync", dependencies=[Depends(verify_token)])
def sync_quests(payload: QuestSyncPayload):
    now = datetime.now(timezone.utc).isoformat()
    full_blob = json.dumps(payload.model_dump())

    if DATABASE_URL:
        with get_pg() as conn:
            conn.execute(
                """
                INSERT INTO character_quests (character_id, character_name, quest_data, updated_at)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT(character_id) DO UPDATE SET
                    character_name = excluded.character_name,
                    quest_data = excluded.quest_data,
                    updated_at = excluded.updated_at
                """,
                (payload.character_id, payload.character_name, full_blob, now),
            )
    else:
        with get_sqlite() as conn:
            conn.execute(
                """
                INSERT INTO character_quests (character_id, character_name, quest_data, updated_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(character_id) DO UPDATE SET
                    character_name = excluded.character_name,
                    quest_data = excluded.quest_data,
                    updated_at = excluded.updated_at
                """,
                (payload.character_id, payload.character_name, full_blob, now),
            )

    return {"status": "ok", "character_name": payload.character_name, "updated_at": now}


@app.get("/v1/characters")
def list_characters():
    query = "SELECT character_id, character_name, updated_at FROM character_quests ORDER BY updated_at DESC"
    if DATABASE_URL:
        with get_pg() as conn:
            rows = conn.execute(query).fetchall()
        return list(rows)

    with get_sqlite() as conn:
        rows = conn.execute(query).fetchall()
    return [dict(row) for row in rows]


@app.get("/v1/characters/{character_name}")
def get_character_quests(character_name: str):
    if DATABASE_URL:
        with get_pg() as conn:
            row = conn.execute(
                """
                SELECT character_id, character_name, quest_data, updated_at
                FROM character_quests
                WHERE LOWER(character_name) = LOWER(%s)
                """,
                (character_name,),
            ).fetchone()
    else:
        with get_sqlite() as conn:
            row = conn.execute(
                """
                SELECT character_id, character_name, quest_data, updated_at
                FROM character_quests
                WHERE LOWER(character_name) = LOWER(?)
                """,
                (character_name,),
            ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Character not found")

    return {
        "character_id": row["character_id"],
        "character_name": row["character_name"],
        "updated_at": row["updated_at"],
        "data": json.loads(row["quest_data"]),
    }
