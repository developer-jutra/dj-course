import os
import psycopg2
from psycopg2.extras import RealDictCursor

DB_CONFIG = {
    'host': os.environ.get('POSTGRES_HOST', 'localhost'),
    'port': int(os.environ.get('POSTGRES_PORT', '5432')),
    'dbname': os.environ.get('POSTGRES_DB', 'deliveroo'),
    'user': os.environ.get('POSTGRES_USER', 'admin'),
    'password': os.environ.get('POSTGRES_PASSWORD', 'strongpassword123'),
    'sslmode': 'prefer',
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)


def _execute_and_print(sql, params, fetch_all=True):
    """Execute query, print SQL + result + empty line, return result."""
    with get_connection() as conn:
        with conn.cursor() as cur:
            display_sql = cur.mogrify(sql, params).decode('utf-8') if params else sql.strip()
            print(display_sql)
            cur.execute(sql, params)
            result = cur.fetchall() if fetch_all else cur.fetchone()
            print(result)
            print()
            return result


# --- Query Functions ---
def fetch_employees_with_roles_by_warehouse(warehouse_id, verbose=False):
    sql = '''
    SELECT
        e.employee_id,
        e.name AS employee_name,
        e.hire_date,
        STRING_AGG(r.name, ', ') AS roles
    FROM
        employee e
    JOIN
        employee_warehouse ew ON e.employee_id = ew.employee_id
    JOIN
        employee_role er ON e.employee_id = er.employee_id
    JOIN
        role r ON er.role_id = r.role_id
    WHERE
        ew.warehouse_id = %s
        AND e.is_deleted = false
    GROUP BY
        e.employee_id, e.name, e.hire_date
    ORDER BY
        e.name;
    '''
    if verbose:
        return _execute_and_print(sql, (warehouse_id,), fetch_all=True)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (warehouse_id,))
            return cur.fetchall()

def get_all_pending_payments(limit=20, verbose=False):
    sql = '''
    SELECT
        payment_id,
        storage_record_id,
        customer_id,
        amount,
        currency,
        status,
        payment_date,
        external_reference
    FROM
        payment
    WHERE
        status = 'pending'
    ORDER BY
        payment_date NULLS LAST, payment_id
    LIMIT %s;
    '''
    if verbose:
        return _execute_and_print(sql, (limit,), fetch_all=True)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (limit,))
            return cur.fetchall()

def get_all_payments_by_customer(customer_id, limit=20, verbose=False):
    sql = '''
    SELECT
        payment_id,
        storage_record_id,
        customer_id,
        amount,
        currency,
        status,
        payment_date,
        external_reference
    FROM
        payment
    WHERE
        customer_id = %s
    ORDER BY
        payment_date NULLS LAST, payment_id
    LIMIT %s;
    '''
    if verbose:
        return _execute_and_print(sql, (customer_id, limit), fetch_all=True)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (customer_id, limit))
            return cur.fetchall()

def get_pending_payments_by_customer(customer_id, limit=20, verbose=False):
    sql = '''
    SELECT
        payment_id,
        storage_record_id,
        customer_id,
        amount,
        currency,
        status,
        payment_date,
        external_reference
    FROM
        payment
    WHERE
        customer_id = %s
        AND status = 'pending'
    ORDER BY
        payment_date NULLS LAST,
        payment_id
    LIMIT %s;
    '''
    if verbose:
        return _execute_and_print(sql, (customer_id, limit), fetch_all=True)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (customer_id, limit))
            return cur.fetchall()

def list_pending_storage_requests(limit=20, verbose=False):
    sql = '''
    SELECT
        request_id,
        customer_id,
        warehouse_id,
        requested_entry_date,
        requested_exit_date,
        status
    FROM
        storage_request
    WHERE
        status = 'pending'
    ORDER BY
        requested_entry_date
    LIMIT %s;
    '''
    if verbose:
        return _execute_and_print(sql, (limit,), fetch_all=True)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (limit,))
            return cur.fetchall()

def storage_event_history_for_storage_record(storage_record_id, limit=20, verbose=False):
    sql = '''
    SELECT
        event_id,
        storage_record_id,
        event_type_id,
        event_time,
        employee_id,
        details
    FROM
        storage_event_history
    WHERE
        storage_record_id = %s
    ORDER BY
        event_time
    LIMIT %s;
    '''
    if verbose:
        return _execute_and_print(sql, (storage_record_id, limit), fetch_all=True)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (storage_record_id, limit))
            return cur.fetchall()

def get_table_row_and_row_counts(verbose=False):
    sql_tables = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            if verbose:
                print(sql_tables.strip())
            cur.execute(sql_tables)
            tables = [row['table_name'] for row in cur.fetchall()]
            if verbose:
                print([t for t in tables])
                print()
            results = []
            for table in tables:
                count_sql = f'SELECT COUNT(*) AS row_count FROM "{table}";'
                if verbose:
                    print(count_sql)
                cur.execute(count_sql)
                row_count = cur.fetchone()['row_count']
                results.append({'table': table, 'row_count': row_count})
                if verbose:
                    print({'table': table, 'row_count': row_count})
                    print()
            return results

def get_customer_details(customer_id, verbose=False):
    sql = """
    WITH customer_base AS (
        SELECT
            c.customer_id,
            c.name AS customer_name,
            c.email,
            c.phone,
            c.status,
            c.tax_id_number,
            c.created_at,
            c.updated_at
        FROM customer c
        WHERE c.customer_id = %s AND c.is_deleted = false
    ),
    customer_contacts AS (
        SELECT
            customer_id,
            json_agg(json_build_object('type', type, 'details', details)) AS contacts
        FROM customer_contact
        WHERE customer_id = %s
        GROUP BY customer_id
    ),
    customer_addresses AS (
        SELECT
            customer_id,
            json_agg(json_build_object(
                'address_type', address_type,
                'street_address', street_address,
                'city', city,
                'country', country,
                'postal_code', postal_code
            )) AS addresses
        FROM customer_address
        WHERE customer_id = %s
        GROUP BY customer_id
    ),
    customer_employees AS (
        SELECT
            ce.customer_id,
            e.employee_id,
            e.name AS employee_name,
            e.email AS employee_email,
            e.phone AS employee_phone,
            ce.job_title,
            ce.employee_type
        FROM customer_employee ce
        JOIN employee e ON ce.employee_id = e.employee_id
        WHERE ce.customer_id = %s AND e.is_deleted = false
    ),
    aggregated_employees AS (
        SELECT
            customer_id,
            json_agg(json_build_object(
                'employee_id', employee_id,
                'employee_name', employee_name,
                'employee_email', employee_email,
                'employee_phone', employee_phone,
                'job_title', job_title,
                'employee_type', employee_type
            )) AS employees
        FROM customer_employees
        GROUP BY customer_id
    )
    SELECT
        cb.*,
        cc.contacts,
        ca.addresses,
        ae.employees
    FROM customer_base cb
    LEFT JOIN customer_contacts cc ON cb.customer_id = cc.customer_id
    LEFT JOIN customer_addresses ca ON cb.customer_id = ca.customer_id
    LEFT JOIN aggregated_employees ae ON cb.customer_id = ae.customer_id;
    """
    if verbose:
        return _execute_and_print(sql, (customer_id, customer_id, customer_id, customer_id), fetch_all=False)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (customer_id, customer_id, customer_id, customer_id))
            return cur.fetchone()

# --- Automated Console Test ---
def run_all_queries_test():
    print('--- Employees with roles by warehouse ---')
    for wid in [1]:
        fetch_employees_with_roles_by_warehouse(wid, verbose=True)
    print('--- All pending payments ---')
    get_all_pending_payments(limit=5, verbose=True)
    print('--- All payments by customer ---')
    for cid in [1, 2]:
        get_all_payments_by_customer(cid, limit=5, verbose=True)
    print('--- Pending payments by customer ---')
    for cid in [1, 2]:
        get_pending_payments_by_customer(cid, limit=5, verbose=True)
    print('--- Pending storage requests ---')
    list_pending_storage_requests(limit=5, verbose=True)
    print('--- Storage event history for storage record ---')
    for srid in [1, 2]:
        storage_event_history_for_storage_record(srid, limit=5, verbose=True)
    print('--- Table row counts ---')
    table_info = get_table_row_and_row_counts(verbose=True)
    empty_tables = [info['table'] for info in table_info if info['row_count'] == 0]
    if empty_tables:
        print(f"Empty tables: {empty_tables}")
        print()
    print('--- Customer details ---')
    for cid in [1, 2, 3]:
        get_customer_details(cid, verbose=True)
