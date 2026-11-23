from sqlalchemy import select
from sqlalchemy.orm import Session

from app.adapters.models import Invoice


class AccountRepository:
    def __init__(self, session: Session):
        self.session = session

    def get(self, account_id: int):
        ...

    def save(self, account) -> None:
        ...

    def invoices_for(self, account_id: int) -> list[Invoice]:
        return list(self.session.execute(select(Invoice).where(Invoice.account_id == account_id)).scalars())
