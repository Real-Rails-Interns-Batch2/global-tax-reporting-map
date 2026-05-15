from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text
)

from sqlalchemy.orm import (
    declarative_base,
    sessionmaker
)

DATABASE_URL = "sqlite:///memory.db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


class Conversation(Base):

    __tablename__ = "conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    role = Column(String)

    content = Column(Text)


Base.metadata.create_all(
    bind=engine
)