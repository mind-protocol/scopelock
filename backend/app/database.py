"""
Database models and connection management

Uses PostgreSQL via SQLAlchemy ORM.
"""

import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

# Database URL from environment (Render provides DATABASE_URL)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/scopelock_dev")

# Create engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    echo=settings.environment == "development"  # Log SQL in dev
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


# ============================================================================
# Models
# ============================================================================

class Event(Base):
    """Event log - append-only audit trail"""
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event = Column(String(50), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    payload = Column(JSON, nullable=False)

    def __repr__(self):
        return f"<Event {self.event} at {self.timestamp}>"


class Draft(Base):
    """Response drafts awaiting approval"""
    __tablename__ = "drafts"

    id = Column(String(36), primary_key=True)  # UUID
    client = Column(String(200), nullable=False)
    job_title = Column(String(500), nullable=False)
    message = Column(Text, nullable=False)
    draft_text = Column(Text, nullable=False)
    confidence = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default="pending")  # pending, approved, rejected
    telegram_message_id = Column(String(50))
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Draft {self.id} for {self.client} ({self.status})>"


class Lead(Base):
    """Lead evaluations from Emma"""
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    budget = Column(String(100), nullable=False)
    decision = Column(String(10), nullable=False, index=True)  # GO, NO-GO
    reason = Column(Text, nullable=False)
    urgency = Column(Integer)  # 1-10
    pain = Column(Integer)  # 1-10
    link = Column(String(500))
    sent = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)

    def __repr__(self):
        return f"<Lead {self.platform}: {self.title} ({self.decision})>"


# ============================================================================
# Database initialization
# ============================================================================

def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """
    Dependency for FastAPI routes

    Usage:
        @app.get("/api/events")
        def get_events(db: Session = Depends(get_db)):
            events = db.query(Event).all()
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
