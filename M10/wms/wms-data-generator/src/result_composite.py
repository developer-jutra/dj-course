from src.config import VERBOSE

class ResultComposite:
    def __init__(self):
        """Initialize with empty lines list, stats dict, and data dict."""
        self.lines = []
        self.stats = {}
        self.data = {}
        
        # Mapping from data keys to table names for verbose output
        self.table_name_map = {
            'locations': 'location',
            'warehouses': 'warehouse',
            'roles': 'role',
            'contractor_parties': 'party',
            'party_relationships': 'party_relationship',
            'party_contacts': 'party_contact',
            'contractor_addresses': 'address',
            'employee_parties': 'party',
            'employee_addresses': 'address',
            'employee_contacts': 'party_contact',
            'party_roles': 'party_role',
            'employee_warehouses': 'employee_warehouse',
            'cargo_event_types': 'cargo_event_type',
            'zones': 'zone',
            'aisles': 'aisle',
            'racks': 'rack',
            'shelves': 'shelf',
            'storage_requests': 'storage_request',
            'storage_reservations': 'storage_reservation',
            'storage_records': 'storage_record',
            'cargo_event_history': 'cargo_event_history',
            'payments': 'payment',
        }
    
    def merge_with(self, other):
        """Merge another ResultComposite instance into this one."""
        if not isinstance(other, ResultComposite):
            raise TypeError("Can only merge with another ResultComposite instance")
        
        # Extend lines
        self.lines.extend(other.lines)
        
        # Merge stats (add values for existing keys, create new keys)
        for key, value in other.stats.items():
            if key not in self.stats:
                self.stats[key] = 0
            self.stats[key] += value
        
        # Merge data (extend lists for existing keys, create new keys)
        for key, value in other.data.items():
            if key not in self.data:
                self.data[key] = []
            self.data[key].extend(value)
        
        return self
    
    def add_line(self, line):
        """Add a single line to the lines list."""
        self.lines.append(line)
        return self
    
    def add_lines(self, lines):
        """Add multiple lines to the lines list."""
        self.lines.extend(lines)
        return self
    
    def add_data(self, key, data_list):
        """Add data to a key and automatically update stats."""
        if not isinstance(data_list, list):
            raise TypeError("data_list must be a list")
        
        # Print verbose message before adding data
        if VERBOSE:
            table_name = self.table_name_map.get(key, key)
            count = len(data_list)
            print(f"- Table `{table_name}`, generating {count} records...", flush=True)
        
        # Initialize key with empty list if it doesn't exist
        if key not in self.data:
            self.data[key] = []
        
        # Extend the existing list with new data
        self.data[key].extend(data_list)
        
        # Automatically update stats with the total count
        self.stats[key] = len(self.data[key])
        
        # Print done message after adding data
        if VERBOSE:
            print("- done...", flush=True)
        
        return self
    
    def to_dict(self):
        """Convert to dictionary format for backward compatibility."""
        return {
            'lines': self.lines,
            'stats': self.stats,
            'data': self.data
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create ResultComposite from dictionary format."""
        instance = cls()
        instance.lines = data.get('lines', [])
        instance.stats = data.get('stats', {})
        instance.data = data.get('data', {})
        return instance
