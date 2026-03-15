from .payments import generate_payments, payments_insert_sql
from src.result_composite import ResultComposite

def generate_payments_data(contractor_parties, storage_records):
    result = ResultComposite()
    
    # --- Payments ---
    payments = generate_payments(contractor_parties, storage_records)
    result.add_line("\n-- Payments")
    result.add_line(payments_insert_sql(payments))
    result.add_data('payments', payments)
    
    return result
