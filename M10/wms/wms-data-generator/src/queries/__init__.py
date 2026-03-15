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
        p.party_id,
        p.name AS employee_name,
        p.created_at AS hire_date,
        STRING_AGG(r.name, ', ') AS roles
    FROM
        party p
    JOIN
        employee_warehouse ew ON p.party_id = ew.party_id
    JOIN
        party_role pr ON p.party_id = pr.party_id
    JOIN
        role r ON pr.role_id = r.role_id
    WHERE
        ew.warehouse_id = %s
        AND p.data->>'type' = 'employee'
    GROUP BY
        p.party_id
    ORDER BY
        p.name;
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
        party_id,
        amount,
        currency,
        status,
        payment_date,
        external_reference
    FROM
        payment
    WHERE
        status = 'PENDING'
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

def get_all_payments_by_party(party_id, limit=20, verbose=False):
    sql = '''
    SELECT
        payment_id,
        storage_record_id,
        party_id,
        amount,
        currency,
        status,
        payment_date,
        external_reference
    FROM
        payment
    WHERE
        party_id = %s
    ORDER BY
        payment_date NULLS LAST, payment_id
    LIMIT %s;
    '''
    if verbose:
        return _execute_and_print(sql, (party_id, limit), fetch_all=True)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (party_id, limit))
            return cur.fetchall()

def get_pending_payments_by_party(party_id, limit=20, verbose=False):
    sql = '''
    SELECT
        payment_id,
        storage_record_id,
        party_id,
        amount,
        currency,
        status,
        payment_date,
        external_reference
    FROM
        payment
    WHERE
        party_id = %s
        AND status = 'pending'
    ORDER BY
        payment_date NULLS LAST,
        payment_id
    LIMIT %s;
    '''
    if verbose:
        return _execute_and_print(sql, (party_id, limit), fetch_all=True)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (party_id, limit))
            return cur.fetchall()

def list_pending_storage_requests(limit=20, verbose=False):
    sql = '''
    SELECT
        request_id,
        issuing_party_id,
        warehouse_id,
        requested_entry_date,
        requested_exit_date,
        status
    FROM
        storage_request
    WHERE
        status = 'PENDING'
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
        party_id,
        details
    FROM
        cargo_event_history
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

def get_contractor_details(contractor_party_id, verbose=False):
    sql = """
    WITH contractor_base AS (
        SELECT
            p.party_id,
            p.name AS contractor_name,
            p.data,
            p.created_at,
            p.updated_at
        FROM party p
        WHERE p.party_id = %s AND p.data->>'type' = 'contractor_company'
    ),
    contractor_contacts AS (
        SELECT
            party_id,
            json_agg(json_build_object('type', type, 'details', details)) AS contacts
        FROM party_contact
        WHERE party_id = %s
        GROUP BY party_id
    ),
    employee_parties AS (
        SELECT
            pr.party_id_primary,
            p.party_id AS employee_id,
            p.name AS employee_name,
            p.data AS employee_data,
            (SELECT json_agg(json_build_object('type', pc.type, 'details', pc.details))
             FROM party_contact pc WHERE pc.party_id = p.party_id) AS contacts
        FROM party_relationship pr
        JOIN party p ON pr.party_id_secondary = p.party_id
        WHERE pr.party_id_primary = %s AND pr.relationship_type = 'REPRESENTATIVE'
    ),
    aggregated_employees AS (
        SELECT
            party_id_primary,
            json_agg(json_build_object(
                'employee_id', employee_id,
                'employee_name', employee_name,
                'employee_data', employee_data,
                'contacts', contacts
            )) AS employees
        FROM employee_parties
        GROUP BY party_id_primary
    )
    SELECT
        cb.*,
        cc.contacts,
        ae.employees
    FROM contractor_base cb
    LEFT JOIN contractor_contacts cc ON cb.party_id = cc.party_id
    LEFT JOIN aggregated_employees ae ON cb.party_id = ae.party_id_primary;
    """
    if verbose:
        return _execute_and_print(sql, (contractor_party_id, contractor_party_id, contractor_party_id), fetch_all=False)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (contractor_party_id, contractor_party_id, contractor_party_id))
            return cur.fetchone()

# --- Automated Console Test ---
def run_all_queries_test():
    print('--- Employees with roles by warehouse ---')
    for wid in [1]:
        fetch_employees_with_roles_by_warehouse(wid, verbose=True)
    print('--- All pending payments ---')
    get_all_pending_payments(limit=5, verbose=True)
    print('--- All payments by party ---')
    for pid in [1, 2]:
        get_all_payments_by_party(pid, limit=5, verbose=True)
    print('--- Pending payments by party ---')
    for pid in [1, 2]:
        get_pending_payments_by_party(pid, limit=5, verbose=True)
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
    print('--- Contractor details ---')
    for cid in [1, 2, 3]:
        get_contractor_details(cid, verbose=True)
