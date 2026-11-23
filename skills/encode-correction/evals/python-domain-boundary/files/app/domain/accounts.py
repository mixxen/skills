from app.adapters.repository import AccountRepository


def close_account(repo: AccountRepository, account_id: int) -> None:
    account = repo.get(account_id)
    account.closed = True
    repo.save(account)
