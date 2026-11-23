from sqlalchemy import select
from sqlalchemy.orm import Session

from app.adapters.models import Invoice


def unpaid_total(session: Session, account_id: int) -> int:
    rows = session.execute(select(Invoice).where(Invoice.account_id == account_id)).scalars()
    return sum(r.amount for r in rows if not r.paid)
