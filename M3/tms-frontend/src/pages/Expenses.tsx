import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { CalendarIcon, Search, Filter, Download, Plus, FileText, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/tailwind/utils';
import { mockExpenses } from '@/model/expenses/expenses.mocks';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface Filters {
  search: string;
  expenseType: string;
  category: string;
  status: string;
  paymentStatus: string;
  vehicle: string;
  transporter: string;
  vendor: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  amountMin: string;
  amountMax: string;
  recurrence: string;
}
const expenseTypes = ['All', 'Fuel', 'Maintenance', 'Toll', 'Insurance', 'Salary', 'Repairs', 'Accommodation', 'Tires', 'Other'];
const categories = ['All', 'Fixed', 'Variable', 'Operational', 'Administrative'];
const statuses = ['All', 'Pending', 'Approved', 'Rejected'];
const paymentStatuses = ['All', 'Paid', 'Unpaid', 'Partially Paid'];
const vehicles = ['All', 'TRK-123', 'TRK-456', 'TRK-789', 'TRK-321', 'TRK-654', 'TRK-987'];
const transporters = ['All', 'John Smith', 'Mike Brown', 'Sarah Lee', 'David Chen', 'Alex Rodriguez', 'Lisa Park', 'Fleet Manager', 'HR Department'];
const vendors = ['All', 'Orlen', 'Bosch Service', 'PZU Insurance', 'GDDKiA', 'AutoService Plus', 'Internal', 'Hotel Europa', 'Michelin Center'];

const Expenses = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    expenseType: 'All',
    category: 'All',
    status: 'All',
    paymentStatus: 'All',
    vehicle: 'All',
    transporter: 'All',
    vendor: 'All',
    dateFrom: null,
    dateTo: null,
    amountMin: '',
    amountMax: '',
    recurrence: 'All'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showDataTable, setShowDataTable] = useState(true);
  const [showCharts, setShowCharts] = useState(true);

  // Filter expenses based on current filters
  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter(expense => {
      // Search filter
      if (filters.search && !Object.values(expense).some(value => 
        value.toString().toLowerCase().includes(filters.search.toLowerCase())
      )) {
        return false;
      }

      // Expense type filter
      if (filters.expenseType !== 'All' && expense.expenseType !== filters.expenseType) {
        return false;
      }

      // Category filter
      if (filters.category !== 'All' && expense.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== 'All' && expense.status !== filters.status) {
        return false;
      }

      // Payment status filter
      if (filters.paymentStatus !== 'All' && expense.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // Vehicle filter
      if (filters.vehicle !== 'All' && expense.vehicle !== filters.vehicle) {
        return false;
      }

      // Transporter filter
      if (filters.transporter !== 'All' && expense.transporter !== filters.transporter) {
        return false;
      }

      // Vendor filter
      if (filters.vendor !== 'All' && expense.vendor !== filters.vendor) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && new Date(expense.date) < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && new Date(expense.date) > filters.dateTo) {
        return false;
      }

      // Amount range filter
      if (filters.amountMin && expense.amount < parseFloat(filters.amountMin)) {
        return false;
      }
      if (filters.amountMax && expense.amount > parseFloat(filters.amountMax)) {
        return false;
      }

      // Recurrence filter
      if (filters.recurrence !== 'All') {
        const isRecurring = filters.recurrence === 'Recurring';
        if (expense.recurrence !== isRecurring) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Partially Paid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      expenseType: 'All',
      category: 'All',
      status: 'All',
      paymentStatus: 'All',
      vehicle: 'All',
      transporter: 'All',
      vendor: 'All',
      dateFrom: null,
      dateTo: null,
      amountMin: '',
      amountMax: '',
      recurrence: 'All'
    });
    setCurrentPage(1);
  };

  // Calculate summary metrics
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingCount = filteredExpenses.filter(e => e.status === 'Pending').length;
  const unpaidCount = filteredExpenses.filter(e => e.paymentStatus === 'Unpaid').length;

  // Chart data calculations
  const expensesByType = useMemo(() => {
    const typeMap = new Map();
    filteredExpenses.forEach(expense => {
      const current = typeMap.get(expense.expenseType) || 0;
      typeMap.set(expense.expenseType, current + expense.amount);
    });
    return Array.from(typeMap.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map();
    filteredExpenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const expensesByMonth = useMemo(() => {
    const monthMap = new Map();
    filteredExpenses.forEach(expense => {
      const month = expense.date.substring(0, 7); // YYYY-MM
      const current = monthMap.get(month) || 0;
      monthMap.set(month, current + expense.amount);
    });
    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));
  }, [filteredExpenses]);

  const expensesByVehicle = useMemo(() => {
    const vehicleMap = new Map();
    filteredExpenses.forEach(expense => {
      if (expense.vehicle) {
        const current = vehicleMap.get(expense.vehicle) || 0;
        vehicleMap.set(expense.vehicle, current + expense.amount);
      }
    });
    return Array.from(vehicleMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([vehicle, amount]) => ({ vehicle, amount }));
  }, [filteredExpenses]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  const handleViewDetails = (expenseId: string) => {
    navigate(`/expenses/${expenseId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage all transportation expenses</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">💰</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()} PLN</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">⏳</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">💳</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Unpaid</p>
                <p className="text-2xl font-bold text-red-600">{unpaidCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">📊</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-green-600">{filteredExpenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Search & Filters</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search expenses..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <Label>Expense Type</Label>
                <Select value={filters.expenseType} onValueChange={(value) => setFilters(prev => ({ ...prev, expenseType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment Status</Label>
                <Select value={filters.paymentStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Vehicle</Label>
                <Select value={filters.vehicle} onValueChange={(value) => setFilters(prev => ({ ...prev, vehicle: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Transporter</Label>
                <Select value={filters.transporter} onValueChange={(value) => setFilters(prev => ({ ...prev, transporter: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transporters.map(transporter => (
                      <SelectItem key={transporter} value={transporter}>{transporter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom || undefined}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date || null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Date To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo || undefined}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date || null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Min Amount</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.amountMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, amountMin: e.target.value }))}
                />
              </div>

              <div>
                <Label>Max Amount</Label>
                <Input
                  type="number"
                  placeholder="999999"
                  value={filters.amountMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, amountMax: e.target.value }))}
                />
              </div>

              <div>
                <Label>Recurrence</Label>
                <Select value={filters.recurrence} onValueChange={(value) => setFilters(prev => ({ ...prev, recurrence: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                    <SelectItem value="One-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Vendor</Label>
                <Select value={filters.vendor} onValueChange={(value) => setFilters(prev => ({ ...prev, vendor: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expenses Table */}
      {showDataTable && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Expenses ({filteredExpenses.length} records)</CardTitle>
                <CardDescription>Detailed view of all expenses</CardDescription>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowDataTable(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Transporter</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.date}</TableCell>
                      <TableCell>{expense.expenseType}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="font-semibold">
                        {expense.amount.toLocaleString()} {expense.currency}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{expense.vehicle || '-'}</TableCell>
                      <TableCell>{expense.transporter}</TableCell>
                      <TableCell>{expense.vendor}</TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(expense.paymentStatus)}>
                          {expense.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(expense.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!showDataTable && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Data Table (Hidden)</CardTitle>
              <Button
                variant="ghost"
                onClick={() => setShowDataTable(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Charts Section */}
      {showCharts && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Expense Analytics</CardTitle>
                <CardDescription>Visual breakdown of expense data</CardDescription>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowCharts(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expenses by Type - Pie Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Expenses by Type</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`${value.toLocaleString()} PLN`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expenses by Category - Bar Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Expenses by Category</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`${value.toLocaleString()} PLN`, 'Amount']} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Trend - Line Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Monthly Expense Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expensesByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`${value.toLocaleString()} PLN`, 'Amount']} />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Vehicles by Expense - Bar Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Top Vehicles by Expense</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesByVehicle} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="vehicle" type="category" width={80} />
                      <RechartsTooltip formatter={(value) => [`${value.toLocaleString()} PLN`, 'Amount']} />
                      <Bar dataKey="amount" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!showCharts && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Expense Analytics (Hidden)</CardTitle>
              <Button
                variant="ghost"
                onClick={() => setShowCharts(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default Expenses;
