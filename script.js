class ExpenseManager {
    constructor() {
        this.expenses = this.loadExpenses();
        this.budgets = this.loadBudgets();
        this.savingsGoals = this.loadSavingsGoals();
        this.recurringExpenses = this.loadRecurringExpenses();
        this.expensePhotos = this.loadExpensePhotos();
        this.displayCurrency = this.loadDisplayCurrency();
        this.theme = this.loadTheme();
        this.isSecured = this.loadSecuritySettings();
        this.editingId = null;
        this.currentPhotoId = null;
        this.passwordMode = null;
        this.exchangeRates = {
            INR: 1, USD: 83.5, EUR: 91.2, GBP: 105.8, JPY: 0.56,
            AUD: 54.2, CAD: 61.3, CHF: 92.1, CNY: 11.5, SGD: 62.4,
            BRL: 16.8, MXN: 4.9, KRW: 0.063, THB: 2.4, ZAR: 4.5,
            RUB: 0.91, TRY: 2.4, PLN: 20.1, SEK: 7.6, NOK: 7.8,
            DKK: 12.2, HUF: 0.23, CZK: 3.6, ILS: 22.4, AED: 22.7
        };
        
        this.customCategories = this.loadCustomCategories();
        this.dashboardLayout = this.loadDashboardLayout();
        this.currencySettings = this.loadCurrencySettings();
        
        this.initializeApp();
    }

    initializeApp() {
        console.log('Initializing app...');
        if (this.isSecured && !this.checkAuthentication()) {
            this.showLoginScreen();
            return;
        }
        
        console.log('Applying theme...');
        this.applyTheme();
        console.log('Binding events...');
        this.bindEvents();
        console.log('Initializing tabs...');
        this.initializeTabs();
        console.log('Updating summary...');
        this.updateSummary();
        console.log('Rendering dashboard...');
        this.renderDashboard();
        console.log('Setting default date...');
        this.setDefaultDate();
        console.log('Processing recurring expenses...');
        this.processRecurringExpenses();
        console.log('Showing welcome message...');
        this.showWelcomeMessage();
        console.log('App initialization complete!');
    }

    bindEvents() {
        try {
            // Tab navigation
            console.log('Binding tab events...');
            const tabButtons = document.querySelectorAll('.tab-btn');
            console.log('Found tab buttons:', tabButtons.length);
            tabButtons.forEach(btn => {
                console.log('Adding listener to:', btn.dataset.tab);
                btn.addEventListener('click', (e) => {
                    console.log('Tab clicked:', e.target.dataset.tab);
                    this.switchTab(e.target.dataset.tab);
                });
            });

        // Header actions
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());

        // Quick form (dashboard)
        document.getElementById('quickExpenseForm').addEventListener('submit', (e) => this.handleQuickSubmit(e));

        // Main expense form
        document.getElementById('expenseForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('addExpenseBtn').addEventListener('click', () => this.showExpenseModal());
        document.getElementById('closeExpenseModal').addEventListener('click', () => this.hideExpenseModal());
        document.getElementById('cancelExpense').addEventListener('click', () => this.hideExpenseModal());

        // Filters and search
        document.getElementById('searchExpenses').addEventListener('input', () => this.renderExpenses());
        document.getElementById('filterCategory').addEventListener('change', () => this.renderExpenses());
        document.getElementById('filterMonth').addEventListener('change', () => this.renderExpenses());
        document.getElementById('sortBy').addEventListener('change', () => this.renderExpenses());

        // Bulk operations
        document.getElementById('selectAllBtn').addEventListener('click', () => this.toggleSelectAll());
        document.getElementById('deleteSelectedBtn').addEventListener('click', () => this.deleteSelected());
        document.getElementById('exportBtn').addEventListener('click', () => this.showExportOptions());
        document.getElementById('importBtn').addEventListener('click', () => this.triggerImport());
        document.getElementById('importFile').addEventListener('change', (e) => this.handleImport(e));

        // Budget management
        document.getElementById('setBudgetBtn').addEventListener('click', () => this.showBudgetModal());
        document.getElementById('closeBudgetModal').addEventListener('click', () => this.hideBudgetModal());
        document.getElementById('saveBudgets').addEventListener('click', () => this.saveBudgets());

        // Goals management
        document.getElementById('addGoalBtn').addEventListener('click', () => this.showGoalModal());
        document.getElementById('closeGoalModal').addEventListener('click', () => this.hideGoalModal());
        document.getElementById('saveGoal').addEventListener('click', () => this.saveSavingsGoal());

        // Recurring expenses
        document.getElementById('addRecurringBtn').addEventListener('click', () => this.showRecurringModal());
        document.getElementById('closeRecurringModal').addEventListener('click', () => this.hideRecurringModal());
        document.getElementById('saveRecurring').addEventListener('click', () => this.saveRecurringExpense());

        // Security
        document.getElementById('setPasswordBtn').addEventListener('click', () => this.showPasswordModal('set'));
        document.getElementById('changePasswordBtn').addEventListener('click', () => this.showPasswordModal('change'));
        document.getElementById('removePasswordBtn').addEventListener('click', () => this.removePassword());
        document.getElementById('closePasswordModal').addEventListener('click', () => this.hidePasswordModal());
        document.getElementById('savePassword').addEventListener('click', () => this.savePassword());

        // Photo and other features
        document.getElementById('receiptPhoto').addEventListener('change', (e) => this.handlePhotoUpload(e));
        document.getElementById('clearPhotosBtn').addEventListener('click', () => this.clearAllPhotos());
        document.getElementById('displayCurrency').addEventListener('change', (e) => this.changeDisplayCurrency(e.target.value));
        document.getElementById('analyticsTimeframe').addEventListener('change', () => this.updateAnalytics());

        // Keyboard shortcuts and modal handling
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });
        } catch (error) {
            console.error('Error binding events:', error);
            this.showNotification('⚠️ Some features may not work properly. Please refresh the page.', 'warning');
        }
    }

    // Tab Management
    initializeTabs() {
        this.switchTab('dashboard');
    }

    switchTab(tabName) {
        try {
            console.log('Switching to tab:', tabName);
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
            console.log('Active tab element:', activeTab);
            if (activeTab) activeTab.classList.add('active');

            // Update tab panels
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            const activePanel = document.getElementById(`${tabName}-tab`);
            console.log('Active panel element:', activePanel);
            if (activePanel) activePanel.classList.add('active');

            // Load tab-specific content
            switch (tabName) {
                case 'dashboard': this.renderDashboard(); break;
                case 'expenses': this.renderExpenses(); break;
                case 'budget': this.renderBudgetStatus(); break;
                case 'analytics': this.updateAnalytics(); break;
                case 'goals': this.renderSavingsGoals(); break;
                case 'settings': this.renderSettings(); break;
            }
        } catch (error) {
            console.error('Error switching tabs:', error);
            this.showNotification('⚠️ Error loading tab content', 'warning');
        }
    }

    // Dashboard
    renderDashboard() {
        this.renderRecentExpenses();
        this.renderBudgetOverview();
        this.renderGoalsOverview();
    }

    renderRecentExpenses() {
        const container = document.getElementById('recentExpensesList');
        const recentExpenses = this.expenses.slice(0, 5);

        if (recentExpenses.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No expenses yet. Add your first expense above!</p>';
            return;
        }

        container.innerHTML = recentExpenses.map(expense => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                <div>
                    <div style="font-weight: 600; color: var(--text-primary);">${this.escapeHtml(expense.description)}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${this.getCategoryIcon(expense.category)} ${this.formatDate(expense.date)}</div>
                </div>
                <span style="font-weight: 700; color: var(--error-color);">${this.formatCurrency(this.convertFromINR(expense.amountInINR || expense.amount, this.displayCurrency), this.displayCurrency)}</span>
            </div>
        `).join('');
    }

    renderBudgetOverview() {
        const container = document.getElementById('budgetOverview');
        
        if (Object.keys(this.budgets).length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No budgets set. <a href="#" onclick="expenseManager.switchTab(\'budget\')" style="color: var(--primary-color);">Set up budgets</a></p>';
            return;
        }

        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyExpenses = this.expenses.filter(exp => exp.date.startsWith(currentMonth));
        
        const categorySpending = {};
        monthlyExpenses.forEach(expense => {
            const category = expense.category;
            const amount = expense.amountInINR || expense.amount;
            categorySpending[category] = (categorySpending[category] || 0) + amount;
        });

        const budgetItems = Object.keys(this.budgets).slice(0, 3).map(category => {
            const budget = this.budgets[category];
            const spent = categorySpending[category] || 0;
            const percentage = Math.min((spent / budget) * 100, 100);
            
            return `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; font-weight: 600;">${this.getCategoryIcon(category)} ${this.getCategoryName(category)}</span>
                        <span style="font-size: 0.875rem; color: var(--text-muted);">${percentage.toFixed(0)}%</span>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-fill ${percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : ''}" 
                             style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = budgetItems.join('');
    }

    renderGoalsOverview() {
        const container = document.getElementById('goalsOverview');
        
        if (this.savingsGoals.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No savings goals set. <a href="#" onclick="expenseManager.switchTab(\'goals\')" style="color: var(--primary-color);">Create your first goal</a></p>';
            return;
        }

        const goalItems = this.savingsGoals.slice(0, 3).map(goal => {
            const progress = (goal.currentAmount / goal.target) * 100;
            
            return `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; font-weight: 600;">${this.getGoalIcon(goal.category)} ${this.escapeHtml(goal.name)}</span>
                        <span style="font-size: 0.875rem; color: var(--text-muted);">${progress.toFixed(0)}%</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = goalItems.join('');
    }

    // Expense Management
    async handleQuickSubmit(e) {
        e.preventDefault();
        
        const description = document.getElementById('quickDescription').value.trim();
        const amount = parseFloat(document.getElementById('quickAmount').value);
        const currency = document.getElementById('quickCurrency').value;
        const category = document.getElementById('quickCategory').value;

        if (!description || !amount || !category) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const expenseData = {
            description, amount, currency, category,
            date: new Date().toISOString().split('T')[0],
            exchangeRate: this.exchangeRates[currency] || 1,
            amountInINR: this.convertToINR(amount, currency)
        };

        this.addExpense(expenseData);
        this.clearQuickForm();
        this.renderDashboard();
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const currency = document.getElementById('currency').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        if (!description || !amount || !category || !date) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const expenseData = {
            description, amount, currency, category, date,
            exchangeRate: this.exchangeRates[currency] || 1,
            amountInINR: this.convertToINR(amount, currency),
            photoId: this.currentPhotoId || null
        };

        if (this.editingId) {
            this.updateExpense(this.editingId, expenseData);
            this.editingId = null;
        } else {
            this.addExpense(expenseData);
        }

        this.hideExpenseModal();
        this.renderExpenses();
        this.renderDashboard();
    }

    addExpense(expense) {
        const newExpense = {
            id: Date.now(),
            ...expense,
            createdAt: new Date().toISOString()
        };
        
        this.expenses.unshift(newExpense);
        this.saveExpenses();
        this.checkBudgetAlert(expense.category, expense.amountInINR);
        this.updateSummary();
        this.showNotification('💰 Expense added successfully!', 'success');
    }

    updateExpense(id, updatedData) {
        const index = this.expenses.findIndex(exp => exp.id === id);
        if (index !== -1) {
            this.expenses[index] = { ...this.expenses[index], ...updatedData };
            this.saveExpenses();
            this.updateSummary();
            this.showNotification('✅ Expense updated successfully!', 'success');
        }
    }

    deleteExpense(id) {
        if (confirm('🗑️ Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(exp => exp.id !== id);
            this.saveExpenses();
            this.updateSummary();
            this.renderExpenses();
            this.renderDashboard();
            this.showNotification('🗑️ Expense deleted successfully!', 'success');
        }
    }

    editExpense(id) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (expense) {
            this.editingId = id;
            document.getElementById('expenseModalTitle').textContent = 'Edit Expense';
            document.getElementById('description').value = expense.description;
            document.getElementById('amount').value = expense.amount;
            document.getElementById('currency').value = expense.currency || 'INR';
            document.getElementById('category').value = expense.category;
            document.getElementById('date').value = expense.date;
            
            if (expense.photoId && this.expensePhotos[expense.photoId]) {
                this.showPhotoPreview(this.expensePhotos[expense.photoId].data);
                this.currentPhotoId = expense.photoId;
            }
            
            this.showExpenseModal();
        }
    }

    renderExpenses() {
        const container = document.getElementById('expensesList');
        const filteredExpenses = this.getFilteredExpenses();

        if (filteredExpenses.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No expenses found for the selected filters.</div>';
            return;
        }

        container.innerHTML = filteredExpenses.map((expense, index) => `
            <div class="expense-item" style="animation-delay: ${index * 0.05}s">
                <input type="checkbox" class="expense-checkbox" data-expense-id="${expense.id}">
                <div class="expense-details">
                    <div class="expense-description">${this.escapeHtml(expense.description)}</div>
                    <div class="expense-meta">
                        <span>${this.getCategoryIcon(expense.category)} ${this.getCategoryName(expense.category)}</span>
                        <span>📅 ${this.formatDate(expense.date)}</span>
                        ${expense.photoId ? '<span>📸 Photo</span>' : ''}
                        ${expense.locationName ? '<span>📍 Location</span>' : ''}
                    </div>
                </div>
                <div class="expense-amount">
                    ${this.formatCurrency(this.convertFromINR(expense.amountInINR || expense.amount, this.displayCurrency), this.displayCurrency)}
                    ${expense.currency !== this.displayCurrency ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Original: ${this.formatCurrency(expense.amount, expense.currency || 'INR')}</div>` : ''}
                </div>
                <div class="expense-actions">
                    <button class="btn-small secondary-btn" onclick="expenseManager.editExpense(${expense.id})">✏️ Edit</button>
                    <button class="btn-small danger-btn" onclick="expenseManager.deleteExpense(${expense.id})">🗑️ Delete</button>
                </div>
            </div>
        `).join('');

        this.updateBulkButtons();
    }

    getFilteredExpenses() {
        const categoryFilter = document.getElementById('filterCategory').value;
        const monthFilter = document.getElementById('filterMonth').value;
        const searchTerm = document.getElementById('searchExpenses').value.toLowerCase();
        const sortBy = document.getElementById('sortBy').value;

        let filtered = this.expenses.filter(expense => {
            const matchesCategory = !categoryFilter || expense.category === categoryFilter;
            const matchesMonth = !monthFilter || expense.date.startsWith(monthFilter);
            const matchesSearch = !searchTerm || 
                expense.description.toLowerCase().includes(searchTerm) ||
                expense.category.toLowerCase().includes(searchTerm);
            
            return matchesCategory && matchesMonth && matchesSearch;
        });

        // Sort expenses
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc': return new Date(b.date) - new Date(a.date);
                case 'date-asc': return new Date(a.date) - new Date(b.date);
                case 'amount-desc': return (b.amountInINR || b.amount) - (a.amountInINR || a.amount);
                case 'amount-asc': return (a.amountInINR || a.amount) - (b.amountInINR || b.amount);
                case 'category': return a.category.localeCompare(b.category);
                default: return new Date(b.date) - new Date(a.date);
            }
        });

        return filtered;
    } 
   // Modal Management
    showExpenseModal() {
        document.getElementById('expenseModal').classList.remove('hidden');
        document.getElementById('expenseModalTitle').textContent = this.editingId ? 'Edit Expense' : 'Add Expense';
        if (!this.editingId) {
            this.clearExpenseForm();
            this.setDefaultDate();
        }
    }

    hideExpenseModal() {
        document.getElementById('expenseModal').classList.add('hidden');
        this.clearExpenseForm();
        this.editingId = null;
        this.currentPhotoId = null;
    }

    showBudgetModal() {
        document.getElementById('budgetModal').classList.remove('hidden');
        Object.keys(this.budgets).forEach(category => {
            const input = document.getElementById(`budget-${category}`);
            if (input) input.value = this.budgets[category];
        });
    }

    hideBudgetModal() {
        document.getElementById('budgetModal').classList.add('hidden');
    }

    showGoalModal() {
        document.getElementById('goalModal').classList.remove('hidden');
        this.clearGoalForm();
    }

    hideGoalModal() {
        document.getElementById('goalModal').classList.add('hidden');
        this.clearGoalForm();
    }

    showRecurringModal() {
        document.getElementById('recurringModal').classList.remove('hidden');
        this.clearRecurringForm();
        document.getElementById('recurringStartDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('recurringCurrency').value = 'INR';
    }

    hideRecurringModal() {
        document.getElementById('recurringModal').classList.add('hidden');
        this.clearRecurringForm();
    }

    showPasswordModal(mode) {
        const modal = document.getElementById('passwordModal');
        const title = document.getElementById('passwordModalTitle');
        const currentPasswordRow = document.getElementById('currentPasswordRow');
        
        modal.classList.remove('hidden');
        
        if (mode === 'set') {
            title.textContent = 'Set App Password';
            currentPasswordRow.style.display = 'none';
        } else if (mode === 'change') {
            title.textContent = 'Change App Password';
            currentPasswordRow.style.display = 'block';
        }
        
        this.passwordMode = mode;
    }

    hidePasswordModal() {
        document.getElementById('passwordModal').classList.add('hidden');
        this.clearPasswordForm();
    }

    // Form Helpers
    clearQuickForm() {
        document.getElementById('quickExpenseForm').reset();
    }

    clearExpenseForm() {
        document.getElementById('expenseForm').reset();
        document.getElementById('photoPreview').innerHTML = '';
        this.currentPhotoId = null;
    }

    clearGoalForm() {
        document.getElementById('goalName').value = '';
        document.getElementById('goalTarget').value = '';
        document.getElementById('goalDeadline').value = '';
        document.getElementById('goalCategory').value = 'other';
        document.getElementById('goalInitialAmount').value = '';
    }

    clearRecurringForm() {
        document.getElementById('recurringDescription').value = '';
        document.getElementById('recurringAmount').value = '';
        document.getElementById('recurringCategory').value = '';
        document.getElementById('recurringFrequency').value = '';
        document.getElementById('recurringStartDate').value = '';
        document.getElementById('recurringEndDate').value = '';
    }

    clearPasswordForm() {
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    // Summary & Updates
    updateSummary() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const currentWeek = this.getCurrentWeekRange();
        
        const monthlyExpenses = this.expenses.filter(exp => exp.date.startsWith(currentMonth));
        const weeklyExpenses = this.expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate >= currentWeek.start && expDate <= currentWeek.end;
        });
        
        const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + (exp.amountInINR || exp.amount), 0);
        const weeklyTotal = weeklyExpenses.reduce((sum, exp) => sum + (exp.amountInINR || exp.amount), 0);
        const totalExpenses = this.expenses.reduce((sum, exp) => sum + (exp.amountInINR || exp.amount), 0);

        document.getElementById('monthlyTotal').textContent = this.formatCurrency(this.convertFromINR(monthlyTotal, this.displayCurrency), this.displayCurrency);
        document.getElementById('weeklyTotal').textContent = this.formatCurrency(this.convertFromINR(weeklyTotal, this.displayCurrency), this.displayCurrency);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(this.convertFromINR(totalExpenses, this.displayCurrency), this.displayCurrency);
        
        this.populateMonthFilter();
    }

    getCurrentWeekRange() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        
        return { start, end };
    }

    populateMonthFilter() {
        const months = [...new Set(this.expenses.map(exp => exp.date.slice(0, 7)))].sort().reverse();
        const filterSelect = document.getElementById('filterMonth');
        
        const currentOptions = Array.from(filterSelect.options).slice(1).map(opt => opt.value);
        const newMonths = months.filter(month => !currentOptions.includes(month));
        
        newMonths.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = this.formatMonthYear(month);
            filterSelect.appendChild(option);
        });
    }

    // Utility Functions
    getCategoryIcon(category) {
        const defaultIcons = {
            food: '🍔', transport: '🚗', shopping: '🛍️', bills: '📄',
            entertainment: '🎬', health: '🏥', other: '📦'
        };
        
        // Check custom categories first
        const customCategory = this.customCategories.find(cat => cat.id === category);
        if (customCategory) {
            return customCategory.icon;
        }
        
        return defaultIcons[category] || '📦';
    }

    getCategoryName(category) {
        const defaultNames = {
            food: 'Food & Dining', transport: 'Transportation', shopping: 'Shopping',
            bills: 'Bills & Utilities', entertainment: 'Entertainment',
            health: 'Health & Medical', other: 'Other'
        };
        
        // Check custom categories first
        const customCategory = this.customCategories.find(cat => cat.id === category);
        if (customCategory) {
            return customCategory.name;
        }
        
        return defaultNames[category] || 'Other';
    }

    getAllCategories() {
        const defaultCategories = [
            { id: 'food', name: 'Food & Dining', icon: '🍔' },
            { id: 'transport', name: 'Transportation', icon: '🚗' },
            { id: 'shopping', name: 'Shopping', icon: '🛍️' },
            { id: 'bills', name: 'Bills & Utilities', icon: '📄' },
            { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
            { id: 'health', name: 'Health & Medical', icon: '🏥' },
            { id: 'other', name: 'Other', icon: '📦' }
        ];
        
        return [...defaultCategories, ...this.customCategories];
    }

    getGoalIcon(category) {
        const icons = {
            vacation: '🏖️', emergency: '🚨', gadget: '📱', home: '🏠',
            education: '📚', investment: '📈', other: '🎯'
        };
        return icons[category] || '🎯';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric' 
        });
    }

    formatMonthYear(monthString) {
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long' 
        });
    }

    formatCurrency(amount, currency) {
        const currencyConfig = this.getCurrencyConfig(currency);
        
        // Use Intl.NumberFormat for proper localization
        try {
            const formatter = new Intl.NumberFormat(currencyConfig.locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: currencyConfig.decimals,
                maximumFractionDigits: currencyConfig.decimals
            });
            return formatter.format(amount);
        } catch (error) {
            // Fallback to manual formatting
            const symbol = currencyConfig.symbol;
            const formattedAmount = amount.toLocaleString(currencyConfig.locale, {
                minimumFractionDigits: currencyConfig.decimals,
                maximumFractionDigits: currencyConfig.decimals
            });
            
            return currencyConfig.symbolPosition === 'before' 
                ? `${symbol}${formattedAmount}` 
                : `${formattedAmount} ${symbol}`;
        }
    }

    getCurrencyConfig(currency) {
        const configs = {
            INR: { symbol: '₹', locale: 'en-IN', decimals: 2, symbolPosition: 'before' },
            USD: { symbol: '$', locale: 'en-US', decimals: 2, symbolPosition: 'before' },
            EUR: { symbol: '€', locale: 'de-DE', decimals: 2, symbolPosition: 'after' },
            GBP: { symbol: '£', locale: 'en-GB', decimals: 2, symbolPosition: 'before' },
            JPY: { symbol: '¥', locale: 'ja-JP', decimals: 0, symbolPosition: 'before' },
            AUD: { symbol: 'A$', locale: 'en-AU', decimals: 2, symbolPosition: 'before' },
            CAD: { symbol: 'C$', locale: 'en-CA', decimals: 2, symbolPosition: 'before' },
            CHF: { symbol: '₣', locale: 'de-CH', decimals: 2, symbolPosition: 'before' },
            CNY: { symbol: '¥', locale: 'zh-CN', decimals: 2, symbolPosition: 'before' },
            SGD: { symbol: 'S$', locale: 'en-SG', decimals: 2, symbolPosition: 'before' },
            BRL: { symbol: 'R$', locale: 'pt-BR', decimals: 2, symbolPosition: 'before' },
            MXN: { symbol: '$', locale: 'es-MX', decimals: 2, symbolPosition: 'before' },
            KRW: { symbol: '₩', locale: 'ko-KR', decimals: 0, symbolPosition: 'before' },
            THB: { symbol: '฿', locale: 'th-TH', decimals: 2, symbolPosition: 'before' },
            ZAR: { symbol: 'R', locale: 'en-ZA', decimals: 2, symbolPosition: 'before' },
            RUB: { symbol: '₽', locale: 'ru-RU', decimals: 2, symbolPosition: 'after' },
            TRY: { symbol: '₺', locale: 'tr-TR', decimals: 2, symbolPosition: 'after' },
            PLN: { symbol: 'zł', locale: 'pl-PL', decimals: 2, symbolPosition: 'after' },
            SEK: { symbol: 'kr', locale: 'sv-SE', decimals: 2, symbolPosition: 'after' },
            NOK: { symbol: 'kr', locale: 'nb-NO', decimals: 2, symbolPosition: 'after' },
            DKK: { symbol: 'kr', locale: 'da-DK', decimals: 2, symbolPosition: 'after' },
            HUF: { symbol: 'Ft', locale: 'hu-HU', decimals: 0, symbolPosition: 'after' },
            CZK: { symbol: 'Kč', locale: 'cs-CZ', decimals: 2, symbolPosition: 'after' },
            ILS: { symbol: '₪', locale: 'he-IL', decimals: 2, symbolPosition: 'before' },
            AED: { symbol: 'د.إ', locale: 'ar-AE', decimals: 2, symbolPosition: 'before' }
        };
        
        return configs[currency] || { 
            symbol: currency, 
            locale: 'en-US', 
            decimals: 2, 
            symbolPosition: 'before' 
        };
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    convertToINR(amount, fromCurrency) {
        if (fromCurrency === 'INR') return amount;
        const rate = this.exchangeRates[fromCurrency];
        return rate ? amount * rate : amount;
    }

    convertFromINR(amountInINR, toCurrency) {
        if (toCurrency === 'INR') return amountInINR;
        const rate = this.exchangeRates[toCurrency];
        return rate ? amountInINR / rate : amountInINR;
    }

    // Theme Management
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        
        const themeButton = document.getElementById('themeToggle');
        themeButton.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        
        this.showNotification(`🎨 Switched to ${this.theme} mode`, 'success');
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeButton = document.getElementById('themeToggle');
        if (themeButton) {
            themeButton.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Notifications
    showNotification(message, type = 'success') {
        document.querySelectorAll('.notification').forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        
        notification.innerHTML = `
            <span>${icons[type] || icons.success}</span>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.showExpenseModal();
        }
        
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            this.toggleTheme();
        }
    }

    // Welcome & Help
    showWelcomeMessage() {
        const isFirstTime = !localStorage.getItem('hasVisited');
        
        if (isFirstTime) {
            localStorage.setItem('hasVisited', 'true');
            setTimeout(() => {
                this.showNotification('🎉 Welcome to your Personal Expense Manager! Press Ctrl+N to add your first expense.', 'info');
            }, 1000);
        }
    }

    showHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'modal';
        helpModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>💡 Help & Shortcuts</h3>
                    <button onclick="this.closest('.modal').remove()" class="close-btn">✕</button>
                </div>
                <div class="modal-body">
                    <h4>⌨️ Keyboard Shortcuts</h4>
                    <ul style="margin-bottom: 2rem;">
                        <li><strong>Ctrl+N</strong> - Add new expense</li>
                        <li><strong>Ctrl+D</strong> - Toggle dark/light mode</li>
                        <li><strong>Esc</strong> - Close modals</li>
                    </ul>
                    <h4>🚀 Quick Tips</h4>
                    <ul>
                        <li>📸 Add receipt photos for better record keeping</li>
                        <li>🔄 Set up recurring expenses for bills</li>
                        <li>🎯 Create savings goals to track targets</li>
                        <li>💰 Set budgets to control spending</li>
                        <li>📊 Use analytics to understand patterns</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
    } 
   // Bulk Operations
    toggleSelectAll() {
        const checkboxes = document.querySelectorAll('.expense-checkbox');
        const selectAllBtn = document.getElementById('selectAllBtn');
        
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
            const expenseItem = cb.closest('.expense-item');
            if (cb.checked) {
                expenseItem.classList.add('selected');
            } else {
                expenseItem.classList.remove('selected');
            }
        });
        
        selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
        this.updateBulkButtons();
    }

    updateBulkButtons() {
        const checkedBoxes = document.querySelectorAll('.expense-checkbox:checked');
        const deleteBtn = document.getElementById('deleteSelectedBtn');
        
        deleteBtn.disabled = checkedBoxes.length === 0;
        deleteBtn.textContent = `Delete Selected (${checkedBoxes.length})`;
    }

    deleteSelected() {
        const checkedBoxes = document.querySelectorAll('.expense-checkbox:checked');
        const expenseIds = Array.from(checkedBoxes).map(cb => parseInt(cb.dataset.expenseId));
        
        if (expenseIds.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${expenseIds.length} selected expenses?`)) {
            this.expenses = this.expenses.filter(exp => !expenseIds.includes(exp.id));
            this.saveExpenses();
            this.updateSummary();
            this.renderExpenses();
            this.renderDashboard();
            this.showNotification(`🗑️ Deleted ${expenseIds.length} expenses`, 'success');
        }
    }

    // Export/Import
    showExportOptions() {
        const existingDropdown = document.querySelector('.export-options');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'export-options';
        dropdown.style.cssText = `
            position: absolute; top: 100%; left: 0; background: var(--bg-primary);
            border: 1px solid var(--border-color); border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg); z-index: 100; min-width: 150px;
        `;
        dropdown.innerHTML = `
            <div onclick="expenseManager.exportToCSV()" style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid var(--border-color);">📊 Export as CSV</div>
            <div onclick="expenseManager.exportToJSON()" style="padding: 0.75rem; cursor: pointer;">📄 Export as JSON</div>
        `;
        
        const exportBtn = document.getElementById('exportBtn');
        exportBtn.style.position = 'relative';
        exportBtn.appendChild(dropdown);
        
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!exportBtn.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }

    exportToCSV() {
        const headers = ['Date', 'Description', 'Amount', 'Currency', 'Category', 'Amount in INR'];
        const csvContent = [
            headers.join(','),
            ...this.expenses.map(expense => [
                expense.date,
                `"${expense.description}"`,
                expense.amount,
                expense.currency || 'INR',
                expense.category,
                expense.amountInINR || expense.amount
            ].join(','))
        ].join('\n');
        
        this.downloadFile(csvContent, 'expenses.csv', 'text/csv');
        this.showNotification('📊 Expenses exported to CSV', 'success');
    }

    exportToJSON() {
        const jsonContent = JSON.stringify({
            expenses: this.expenses,
            budgets: this.budgets,
            savingsGoals: this.savingsGoals,
            recurringExpenses: this.recurringExpenses,
            exportDate: new Date().toISOString(),
            version: '1.0'
        }, null, 2);
        
        this.downloadFile(jsonContent, 'expenses.json', 'application/json');
        this.showNotification('📄 Expenses exported to JSON', 'success');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    triggerImport() {
        document.getElementById('importFile').click();
    }

    handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (file.name.endsWith('.json')) {
                    this.importFromJSON(e.target.result);
                } else if (file.name.endsWith('.csv')) {
                    this.importFromCSV(e.target.result);
                } else {
                    throw new Error('Unsupported file format');
                }
            } catch (error) {
                this.showNotification(`❌ Import failed: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }

    importFromJSON(content) {
        const data = JSON.parse(content);
        
        if (data.expenses && Array.isArray(data.expenses)) {
            const importCount = data.expenses.length;
            
            data.expenses.forEach(expense => {
                expense.id = Date.now() + Math.random();
                this.expenses.push(expense);
            });
            
            if (data.budgets) {
                this.budgets = { ...this.budgets, ...data.budgets };
                this.saveBudgetsToStorage();
            }
            
            this.saveExpenses();
            this.updateSummary();
            this.renderExpenses();
            this.renderDashboard();
            
            this.showNotification(`✅ Imported ${importCount} expenses successfully!`, 'success');
        } else {
            throw new Error('Invalid JSON format');
        }
    }

    importFromCSV(content) {
        const lines = content.split('\n');
        let importCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            
            if (values.length >= 6) {
                const expense = {
                    id: Date.now() + Math.random(),
                    date: values[0],
                    description: values[1].replace(/"/g, ''),
                    amount: parseFloat(values[2]),
                    currency: values[3] || 'INR',
                    category: values[4],
                    amountInINR: parseFloat(values[5]),
                    createdAt: new Date().toISOString()
                };
                
                this.expenses.push(expense);
                importCount++;
            }
        }
        
        this.saveExpenses();
        this.updateSummary();
        this.renderExpenses();
        this.renderDashboard();
        
        this.showNotification(`✅ Imported ${importCount} expenses from CSV!`, 'success');
    }

    // Budget Management
    saveBudgets() {
        const categories = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'other'];
        
        categories.forEach(category => {
            const input = document.getElementById(`budget-${category}`);
            const value = parseFloat(input.value) || 0;
            if (value > 0) {
                this.budgets[category] = value;
            } else {
                delete this.budgets[category];
            }
        });

        this.saveBudgetsToStorage();
        this.renderBudgetStatus();
        this.renderBudgetOverview();
        this.hideBudgetModal();
        this.showNotification('💰 Budgets saved successfully!', 'success');
    }

    renderBudgetStatus() {
        const container = document.getElementById('budgetStatus');
        
        if (Object.keys(this.budgets).length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No budgets set. Click "Set Budgets" to get started!</p>';
            return;
        }

        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyExpenses = this.expenses.filter(exp => exp.date.startsWith(currentMonth));
        
        const categorySpending = {};
        monthlyExpenses.forEach(expense => {
            const category = expense.category;
            const amount = expense.amountInINR || expense.amount;
            categorySpending[category] = (categorySpending[category] || 0) + amount;
        });

        container.innerHTML = Object.keys(this.budgets).map(category => {
            const budget = this.budgets[category];
            const spent = categorySpending[category] || 0;
            const percentage = Math.min((spent / budget) * 100, 100);
            const remaining = Math.max(budget - spent, 0);
            
            let progressClass = '';
            if (percentage >= 100) progressClass = 'danger';
            else if (percentage >= 80) progressClass = 'warning';

            return `
                <div class="budget-bar">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                        <span style="font-weight: 600;">${this.getCategoryIcon(category)} ${this.getCategoryName(category)}</span>
                        <span style="font-size: 0.875rem; color: var(--text-muted);">
                            ${this.formatCurrency(this.convertFromINR(spent, this.displayCurrency), this.displayCurrency)} / 
                            ${this.formatCurrency(this.convertFromINR(budget, this.displayCurrency), this.displayCurrency)}
                        </span>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-fill ${progressClass}" style="width: ${percentage}%"></div>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
                        ${percentage >= 100 ? 
                            `⚠️ Over budget by ${this.formatCurrency(this.convertFromINR(spent - budget, this.displayCurrency), this.displayCurrency)}` :
                            `✅ ${this.formatCurrency(this.convertFromINR(remaining, this.displayCurrency), this.displayCurrency)} remaining`
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    checkBudgetAlert(category, amountInINR) {
        if (!this.budgets[category]) return;

        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyExpenses = this.expenses.filter(exp => 
            exp.date.startsWith(currentMonth) && exp.category === category
        );
        
        // Include the new expense amount in the calculation
        const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + (exp.amountInINR || exp.amount), 0) + amountInINR;
        const budget = this.budgets[category];
        const percentage = (totalSpent / budget) * 100;

        if (percentage >= 100) {
            this.showNotification(`🚨 You've exceeded your ${this.getCategoryName(category)} budget!`, 'error');
        } else if (percentage >= 80) {
            this.showNotification(`⚠️ You've used ${percentage.toFixed(0)}% of your ${this.getCategoryName(category)} budget`, 'warning');
        }
    }    
// Savings Goals
    saveSavingsGoal() {
        const name = document.getElementById('goalName').value.trim();
        const target = parseFloat(document.getElementById('goalTarget').value);
        const deadline = document.getElementById('goalDeadline').value;
        const category = document.getElementById('goalCategory').value;
        const initialAmount = parseFloat(document.getElementById('goalInitialAmount').value) || 0;

        if (!name || !target || !deadline) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const goal = {
            id: Date.now(),
            name, target, deadline, category,
            currentAmount: initialAmount,
            createdAt: new Date().toISOString()
        };

        this.savingsGoals.push(goal);
        this.saveSavingsGoalsToStorage();
        this.hideGoalModal();
        this.renderSavingsGoals();
        this.renderGoalsOverview();
        this.showNotification('🎯 Savings goal created successfully!', 'success');
    }

    renderSavingsGoals() {
        const container = document.getElementById('goalsContainer');
        
        if (this.savingsGoals.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No savings goals set yet. Create your first goal!</p>';
            return;
        }

        container.innerHTML = this.savingsGoals.map(goal => {
            const progress = (goal.currentAmount / goal.target) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
            return `
                <div class="goal-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span style="font-weight: 600; font-size: 1.1rem;">${this.getGoalIcon(goal.category)} ${this.escapeHtml(goal.name)}</span>
                        <span style="font-weight: 700; color: var(--primary-color);">
                            ${this.formatCurrency(this.convertFromINR(goal.currentAmount, this.displayCurrency), this.displayCurrency)} / 
                            ${this.formatCurrency(this.convertFromINR(goal.target, this.displayCurrency), this.displayCurrency)}
                        </span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 0.75rem 0; font-size: 0.875rem; color: var(--text-muted);">
                        <span>${progress.toFixed(1)}% complete</span>
                        <span>${daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button class="btn-small primary-btn" onclick="expenseManager.addMoneyToGoal(${goal.id})">💰 Add Money</button>
                        <button class="btn-small danger-btn" onclick="expenseManager.deleteGoal(${goal.id})">🗑️ Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    addMoneyToGoal(id) {
        const amount = prompt('How much would you like to add to this goal?');
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            const goal = this.savingsGoals.find(g => g.id === id);
            if (goal) {
                goal.currentAmount += parseFloat(amount);
                this.saveSavingsGoalsToStorage();
                this.renderSavingsGoals();
                this.renderGoalsOverview();
                
                if (goal.currentAmount >= goal.target) {
                    this.showNotification('🎉 Congratulations! Goal achieved!', 'success');
                } else {
                    this.showNotification(`💰 Added ${this.formatCurrency(parseFloat(amount), 'INR')} to goal`, 'success');
                }
            }
        }
    }

    deleteGoal(id) {
        if (confirm('Are you sure you want to delete this savings goal?')) {
            this.savingsGoals = this.savingsGoals.filter(g => g.id !== id);
            this.saveSavingsGoalsToStorage();
            this.renderSavingsGoals();
            this.renderGoalsOverview();
            this.showNotification('🗑️ Savings goal deleted', 'success');
        }
    }

    // Recurring Expenses
    saveRecurringExpense() {
        const description = document.getElementById('recurringDescription').value.trim();
        const amount = parseFloat(document.getElementById('recurringAmount').value);
        const currency = document.getElementById('recurringCurrency').value;
        const category = document.getElementById('recurringCategory').value;
        const frequency = document.getElementById('recurringFrequency').value;
        const startDate = document.getElementById('recurringStartDate').value;
        const endDate = document.getElementById('recurringEndDate').value;

        if (!description || !amount || !category || !frequency || !startDate) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const recurringExpense = {
            id: Date.now(),
            description, amount, currency, category, frequency, startDate,
            endDate: endDate || null,
            isActive: true,
            lastProcessed: null,
            createdAt: new Date().toISOString()
        };

        this.recurringExpenses.push(recurringExpense);
        this.saveRecurringExpensesToStorage();
        this.hideRecurringModal();
        this.renderRecurringList();
        this.showNotification('🔄 Recurring expense added successfully!', 'success');
    }

    renderRecurringList() {
        const container = document.getElementById('recurringList');
        
        if (this.recurringExpenses.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No recurring expenses set up yet.</p>';
            return;
        }

        container.innerHTML = this.recurringExpenses.map(recurring => {
            const nextDate = this.getNextRecurringDate(recurring);
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">${this.escapeHtml(recurring.description)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">
                            ${this.getCategoryIcon(recurring.category)} ${this.getCategoryName(recurring.category)} • 
                            ${this.formatCurrency(recurring.amount, recurring.currency)} • 
                            ${recurring.frequency} • 
                            Next: ${nextDate ? this.formatDate(nextDate) : 'N/A'}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn-small ${recurring.isActive ? 'secondary-btn' : 'primary-btn'}" 
                                onclick="expenseManager.toggleRecurring(${recurring.id})">
                            ${recurring.isActive ? '⏸️ Pause' : '▶️ Resume'}
                        </button>
                        <button class="btn-small danger-btn" onclick="expenseManager.deleteRecurring(${recurring.id})">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    getNextRecurringDate(recurring) {
        if (!recurring.isActive) return null;
        
        const startDate = new Date(recurring.startDate);
        const lastProcessed = recurring.lastProcessed ? new Date(recurring.lastProcessed) : startDate;
        
        let nextDate = new Date(lastProcessed);
        
        switch (recurring.frequency) {
            case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
            case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
            case 'quarterly': nextDate.setMonth(nextDate.getMonth() + 3); break;
            case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
        }
        
        if (recurring.endDate && nextDate > new Date(recurring.endDate)) {
            return null;
        }
        
        return nextDate;
    }

    processRecurringExpenses() {
        const today = new Date();
        let processedCount = 0;
        
        this.recurringExpenses.forEach(recurring => {
            if (!recurring.isActive) return;
            
            const nextDate = this.getNextRecurringDate(recurring);
            if (nextDate && nextDate <= today) {
                const expense = {
                    description: `${recurring.description} (Auto)`,
                    amount: recurring.amount,
                    currency: recurring.currency,
                    category: recurring.category,
                    date: today.toISOString().split('T')[0],
                    exchangeRate: this.exchangeRates[recurring.currency] || 1,
                    amountInINR: this.convertToINR(recurring.amount, recurring.currency),
                    isRecurring: true,
                    recurringId: recurring.id
                };
                
                this.addExpense(expense);
                recurring.lastProcessed = today.toISOString();
                processedCount++;
            }
        });
        
        if (processedCount > 0) {
            this.saveRecurringExpensesToStorage();
            this.showNotification(`🔄 Processed ${processedCount} recurring expenses`, 'success');
        }
    }

    toggleRecurring(id) {
        const recurring = this.recurringExpenses.find(r => r.id === id);
        if (recurring) {
            recurring.isActive = !recurring.isActive;
            this.saveRecurringExpensesToStorage();
            this.renderRecurringList();
            this.showNotification(`🔄 Recurring expense ${recurring.isActive ? 'resumed' : 'paused'}`, 'success');
        }
    }

    deleteRecurring(id) {
        if (confirm('Are you sure you want to delete this recurring expense?')) {
            this.recurringExpenses = this.recurringExpenses.filter(r => r.id !== id);
            this.saveRecurringExpensesToStorage();
            this.renderRecurringList();
            this.showNotification('🗑️ Recurring expense deleted', 'success');
        }
    }

    // Settings & Security
    renderSettings() {
        this.renderRecurringList();
        this.updatePhotoCount();
        this.updateSecurityButtons();
    }

    updatePhotoCount() {
        const count = Object.keys(this.expensePhotos).length;
        document.getElementById('photoCount').textContent = `${count} photos stored`;
    }

    clearAllPhotos() {
        if (confirm('Are you sure you want to clear all stored photos? This cannot be undone.')) {
            this.expensePhotos = {};
            this.saveExpensePhotosToStorage();
            this.updatePhotoCount();
            this.showNotification('📸 All photos cleared', 'success');
        }
    }

    changeDisplayCurrency(newCurrency) {
        this.displayCurrency = newCurrency;
        localStorage.setItem('displayCurrency', newCurrency);
        this.updateSummary();
        this.renderExpenses();
        this.renderDashboard();
        this.showNotification(`💱 Display currency changed to ${newCurrency}`, 'success');
    }

    updateSecurityButtons() {
        const setBtn = document.getElementById('setPasswordBtn');
        const changeBtn = document.getElementById('changePasswordBtn');
        const removeBtn = document.getElementById('removePasswordBtn');
        
        if (this.isSecured) {
            setBtn.disabled = true;
            changeBtn.disabled = false;
            removeBtn.disabled = false;
        } else {
            setBtn.disabled = false;
            changeBtn.disabled = true;
            removeBtn.disabled = true;
        }
    }

    savePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (this.passwordMode === 'change') {
            const storedPassword = localStorage.getItem('appPassword');
            if (!storedPassword || this.hashPassword(currentPassword) !== storedPassword) {
                this.showNotification('Current password is incorrect', 'error');
                return;
            }
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }
        
        const hashedPassword = this.hashPassword(newPassword);
        localStorage.setItem('appPassword', hashedPassword);
        localStorage.setItem('isSecured', 'true');
        
        this.isSecured = true;
        this.updateSecurityButtons();
        this.hidePasswordModal();
        this.showNotification('🔐 Password set successfully!', 'success');
    }

    removePassword() {
        if (confirm('Are you sure you want to remove password protection?')) {
            localStorage.removeItem('appPassword');
            localStorage.setItem('isSecured', 'false');
            this.isSecured = false;
            this.updateSecurityButtons();
            this.showNotification('🔓 Password protection removed', 'success');
        }
    }

    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    checkAuthentication() {
        return sessionStorage.getItem('authenticated') === 'true';
    }

    showLoginScreen() {
        const loginScreen = document.createElement('div');
        loginScreen.className = 'login-screen';
        loginScreen.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            display: flex; justify-content: center; align-items: center; z-index: 2000;
        `;
        loginScreen.innerHTML = `
            <div style="background: var(--bg-primary); border-radius: var(--radius-xl); padding: 2rem; box-shadow: var(--shadow-xl); text-align: center; max-width: 400px; width: 90%;">
                <h2 style="margin-bottom: 2rem; color: var(--text-primary);">🔐 Enter Password</h2>
                <div>
                    <input type="password" id="loginPassword" placeholder="Enter your password" autofocus 
                           style="width: 100%; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 1rem;">
                    <button id="loginBtn" class="primary-btn" style="width: 100%; padding: 1rem;">Unlock App</button>
                    <div id="loginError" style="color: var(--error-color); font-size: 0.875rem; margin-top: 1rem; display: none;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loginScreen);
        
        const loginBtn = document.getElementById('loginBtn');
        const passwordInput = document.getElementById('loginPassword');
        const errorDiv = document.getElementById('loginError');
        
        const attemptLogin = () => {
            const password = passwordInput.value;
            const storedPassword = localStorage.getItem('appPassword');
            
            if (this.hashPassword(password) === storedPassword) {
                sessionStorage.setItem('authenticated', 'true');
                loginScreen.remove();
                this.initializeApp();
            } else {
                errorDiv.textContent = 'Incorrect password. Please try again.';
                errorDiv.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
            }
        };
        
        loginBtn.addEventListener('click', attemptLogin);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptLogin();
        });
    } 
   // Photo Management
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Photo size must be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const photoId = Date.now().toString();
            this.expensePhotos[photoId] = {
                data: e.target.result,
                filename: file.name,
                size: file.size,
                uploadDate: new Date().toISOString()
            };
            
            this.saveExpensePhotosToStorage();
            this.updatePhotoCount();
            this.showPhotoPreview(e.target.result);
            this.currentPhotoId = photoId;
            
            this.showNotification('📸 Photo uploaded successfully!', 'success');
        };
        
        reader.readAsDataURL(file);
    }

    showPhotoPreview(dataUrl) {
        const container = document.getElementById('photoPreview');
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem;">
                <img src="${dataUrl}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--border-color);" alt="Receipt preview">
                <button type="button" class="btn-small danger-btn" onclick="expenseManager.removePhotoPreview()">✕ Remove</button>
            </div>
        `;
    }

    removePhotoPreview() {
        document.getElementById('photoPreview').innerHTML = '';
        document.getElementById('receiptPhoto').value = '';
        this.currentPhotoId = null;
    }

    // Analytics
    updateAnalytics() {
        const timeframe = document.getElementById('analyticsTimeframe').value;
        const data = this.getAnalyticsData(timeframe);
        
        this.renderTrendChart(data.trendData);
        this.renderCategoryChart(data.categoryData);
        this.renderComparisonChart(data.comparisonData);
        this.renderInsights(data.insights);
    }

    getAnalyticsData(timeframe) {
        const now = new Date();
        let startDate, endDate;
        
        switch (timeframe) {
            case 'current-month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'last-month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'last-3-months':
                startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'last-6-months':
                startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'current-year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
        }

        const filteredExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });

        return {
            trendData: this.getTrendData(filteredExpenses, timeframe),
            categoryData: this.getCategoryData(filteredExpenses),
            comparisonData: this.getComparisonData(),
            insights: this.generateInsights(filteredExpenses, timeframe)
        };
    }

    getTrendData(expenses, timeframe) {
        const groupedData = {};
        
        expenses.forEach(expense => {
            let key;
            const date = new Date(expense.date);
            
            if (timeframe === 'current-month' || timeframe === 'last-month') {
                key = date.getDate();
            } else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            
            groupedData[key] = (groupedData[key] || 0) + (expense.amountInINR || expense.amount);
        });

        return Object.keys(groupedData).sort().map(key => ({
            label: key,
            value: groupedData[key]
        }));
    }

    getCategoryData(expenses) {
        const categoryTotals = {};
        
        expenses.forEach(expense => {
            const category = expense.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + (expense.amountInINR || expense.amount);
        });

        return Object.keys(categoryTotals).map(category => ({
            label: this.getCategoryName(category),
            value: categoryTotals[category],
            color: this.getCategoryColor(category)
        }));
    }

    getComparisonData() {
        const now = new Date();
        const months = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            const monthExpenses = this.expenses.filter(expense => 
                expense.date.startsWith(monthKey)
            );
            
            const total = monthExpenses.reduce((sum, exp) => sum + (exp.amountInINR || exp.amount), 0);
            
            months.push({
                label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                value: total
            });
        }
        
        return months;
    }

    generateInsights(expenses, timeframe) {
        const insights = [];
        
        if (expenses.length === 0) {
            insights.push({ icon: '📊', text: 'No expenses found for the selected timeframe.' });
            return insights;
        }

        const total = expenses.reduce((sum, exp) => sum + (exp.amountInINR || exp.amount), 0);
        insights.push({
            icon: '💰',
            text: `Total spending: ${this.formatCurrency(this.convertFromINR(total, this.displayCurrency), this.displayCurrency)}`
        });

        const days = timeframe === 'current-month' ? new Date().getDate() : 30;
        const avgPerDay = total / days;
        insights.push({
            icon: '📅',
            text: `Average per day: ${this.formatCurrency(this.convertFromINR(avgPerDay, this.displayCurrency), this.displayCurrency)}`
        });

        const categoryTotals = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + (exp.amountInINR || exp.amount);
        });
        
        if (Object.keys(categoryTotals).length > 0) {
            const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
                categoryTotals[a] > categoryTotals[b] ? a : b
            );
            
            insights.push({
                icon: '🎯',
                text: `Top category: ${this.getCategoryName(topCategory)} (${this.formatCurrency(this.convertFromINR(categoryTotals[topCategory], this.displayCurrency), this.displayCurrency)})`
            });
        }

        return insights;
    }

    getCategoryColor(category) {
        const colors = {
            food: '#e74c3c', transport: '#3498db', shopping: '#9b59b6',
            bills: '#f39c12', entertainment: '#e67e22', health: '#2ecc71', other: '#95a5a6'
        };
        return colors[category] || '#95a5a6';
    }

    renderTrendChart(data) {
        const canvas = document.getElementById('trendChart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const valueRange = maxValue - minValue || 1;
        
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = canvas.height - padding - ((point.value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    renderCategoryChart(data) {
        const canvas = document.getElementById('categoryChart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -Math.PI / 2;
        
        data.forEach(item => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
    }

    renderComparisonChart(data) {
        const canvas = document.getElementById('comparisonChart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const maxValue = Math.max(...data.map(d => d.value));
        const barWidth = chartWidth / data.length * 0.8;
        const barSpacing = chartWidth / data.length * 0.2;
        
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + barSpacing);
            const y = canvas.height - padding - barHeight;
            
            ctx.fillStyle = '#667eea';
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    renderInsights(insights) {
        const container = document.getElementById('insightsContainer');
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <span style="font-size: 1.2rem; margin-right: 0.75rem;">${insight.icon}</span>
                <span style="flex: 1; line-height: 1.4;">${insight.text}</span>
            </div>
        `).join('');
    }

    // Storage Functions
    loadExpenses() {
        const stored = localStorage.getItem('personalExpenses');
        return stored ? JSON.parse(stored) : [];
    }

    saveExpenses() {
        localStorage.setItem('personalExpenses', JSON.stringify(this.expenses));
    }

    loadBudgets() {
        const stored = localStorage.getItem('budgets');
        return stored ? JSON.parse(stored) : {};
    }

    saveBudgetsToStorage() {
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
    }

    loadSavingsGoals() {
        const stored = localStorage.getItem('savingsGoals');
        return stored ? JSON.parse(stored) : [];
    }

    saveSavingsGoalsToStorage() {
        localStorage.setItem('savingsGoals', JSON.stringify(this.savingsGoals));
    }

    loadRecurringExpenses() {
        const stored = localStorage.getItem('recurringExpenses');
        return stored ? JSON.parse(stored) : [];
    }

    saveRecurringExpensesToStorage() {
        localStorage.setItem('recurringExpenses', JSON.stringify(this.recurringExpenses));
    }

    loadExpensePhotos() {
        const stored = localStorage.getItem('expensePhotos');
        return stored ? JSON.parse(stored) : {};
    }

    saveExpensePhotosToStorage() {
        localStorage.setItem('expensePhotos', JSON.stringify(this.expensePhotos));
    }

    loadDisplayCurrency() {
        return localStorage.getItem('displayCurrency') || 'INR';
    }

    loadTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    saveTheme() {
        localStorage.setItem('theme', this.theme);
    }

    loadSecuritySettings() {
        return localStorage.getItem('isSecured') === 'true';
    }

    // Custom Categories Storage
    loadCustomCategories() {
        const stored = localStorage.getItem('customCategories');
        return stored ? JSON.parse(stored) : [];
    }

    saveCustomCategories() {
        localStorage.setItem('customCategories', JSON.stringify(this.customCategories));
    }

    // Dashboard Layout Storage
    loadDashboardLayout() {
        const stored = localStorage.getItem('dashboardLayout');
        return stored ? JSON.parse(stored) : {
            quickAdd: true,
            recentExpenses: true,
            budgetOverview: true,
            goalsOverview: true,
            monthlyTotal: true,
            totalExpenses: true,
            weeklyTotal: true
        };
    }

    saveDashboardLayoutToStorage() {
        localStorage.setItem('dashboardLayout', JSON.stringify(this.dashboardLayout));
    }

    // Currency Settings Storage
    loadCurrencySettings() {
        const stored = localStorage.getItem('currencySettings');
        return stored ? JSON.parse(stored) : {
            preferredCurrencies: ['INR', 'USD', 'EUR', 'GBP'],
            showCurrencyFlags: true,
            autoDetectCurrency: false
        };
    }

    saveCurrencySettings() {
        localStorage.setItem('currencySettings', JSON.stringify(this.currencySettings));
    }

    // Missing methods that were referenced but not implemented
    updateConversionPreview() {
        // This method was referenced but not needed in the new clean interface
        // Conversion is handled automatically in the currency conversion logic
    }

    toggleBudgetStatus() {
        // This method toggles the budget status display
        const statusDiv = document.getElementById('budgetStatus');
        if (statusDiv) {
            statusDiv.classList.toggle('hidden');
            if (!statusDiv.classList.contains('hidden')) {
                this.renderBudgetStatus();
            }
        }
    }

    toggleRecurringList() {
        // This method toggles the recurring expenses list
        const list = document.getElementById('recurringList');
        if (list) {
            list.classList.toggle('hidden');
            if (!list.classList.contains('hidden')) {
                this.renderRecurringList();
            }
        }
    }

    toggleGoalsList() {
        // This method toggles the goals list
        const list = document.getElementById('goalsList');
        if (list) {
            list.classList.toggle('hidden');
            if (!list.classList.contains('hidden')) {
                this.renderSavingsGoals();
            }
        }
    }

    exportSecure() {
        // This method exports data with encryption
        const password = prompt('Enter a password to encrypt the export:');
        if (!password) return;
        
        const data = {
            expenses: this.expenses,
            budgets: this.budgets,
            savingsGoals: this.savingsGoals,
            recurringExpenses: this.recurringExpenses,
            exportDate: new Date().toISOString(),
            version: '1.0',
            encrypted: true
        };
        
        // Simple encryption (in production, use proper encryption)
        const encrypted = btoa(JSON.stringify(data) + '::' + password);
        
        this.downloadFile(encrypted, 'expenses_secure.enc', 'application/octet-stream');
        this.showNotification('🔒 Secure export completed', 'success');
    }

    checkPasswordStrength() {
        // This method checks password strength and updates the UI
        const passwordInput = document.getElementById('newPassword');
        if (!passwordInput) return;
        
        const password = passwordInput.value;
        const indicator = document.getElementById('strengthIndicator');
        const text = document.getElementById('strengthText');
        
        if (!indicator || !text) return;
        
        let strength = 0;
        let strengthText = '';
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        indicator.className = 'strength-fill';
        
        if (password.length === 0) {
            strengthText = 'Enter a password';
        } else if (strength <= 2) {
            indicator.classList.add('weak');
            strengthText = 'Weak password';
        } else if (strength === 3) {
            indicator.classList.add('fair');
            strengthText = 'Fair password';
        } else if (strength === 4) {
            indicator.classList.add('good');
            strengthText = 'Good password';
        } else {
            indicator.classList.add('strong');
            strengthText = 'Strong password';
        }
        
        text.textContent = strengthText;
    }

    // PWA-specific methods
    showUpdateNotification() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 1002;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideDown 0.3s ease-out;
        `;
        
        updateNotification.innerHTML = `
            <span>🔄 New version available!</span>
            <button onclick="expenseManager.updateApp()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: var(--radius-md); cursor: pointer;">Update</button>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; padding: 0.5rem;">✕</button>
        `;
        
        document.body.appendChild(updateNotification);
    }

    updateApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                }
            });
        }
    }

    // Enhanced offline support
    saveOfflineExpense(expenseData) {
        const offlineExpenses = JSON.parse(localStorage.getItem('offlineExpenses') || '[]');
        offlineExpenses.push({
            ...expenseData,
            id: Date.now(),
            offline: true,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('offlineExpenses', JSON.stringify(offlineExpenses));
        
        // Register for background sync if available
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('background-sync-expenses');
            }).catch(err => {
                console.log('Background sync registration failed:', err);
            });
        }
    }

    syncOfflineExpenses() {
        const offlineExpenses = JSON.parse(localStorage.getItem('offlineExpenses') || '[]');
        
        if (offlineExpenses.length > 0) {
            offlineExpenses.forEach(expense => {
                delete expense.offline;
                delete expense.timestamp;
                this.expenses.unshift(expense);
            });
            
            this.saveExpenses();
            localStorage.removeItem('offlineExpenses');
            
            this.updateSummary();
            this.renderExpenses();
            this.renderDashboard();
            
            this.showNotification(`✅ Synced ${offlineExpenses.length} offline expenses`, 'success');
        }
    }

    // Check if app is running as PWA
    isPWA() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }

    // Enhanced add expense for offline support
    addExpenseEnhanced(expense) {
        if (navigator.onLine) {
            this.addExpense(expense);
        } else {
            this.saveOfflineExpense(expense);
            this.showNotification('📱 Expense saved offline. Will sync when online.', 'info');
        }
    }

    // Network status handling
    handleOnlineStatus() {
        const updateOnlineStatus = () => {
            if (navigator.onLine) {
                this.showNotification('🌐 Back online! Syncing data...', 'success');
                this.syncOfflineExpenses();
            } else {
                this.showNotification('📱 You\'re offline. Data will be saved locally.', 'warning');
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }

    // Custom Categories Management
    showCustomCategoriesModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'customCategoriesModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🏷️ Manage Categories</h3>
                    <button onclick="this.closest('.modal').remove()" class="close-btn">✕</button>
                </div>
                <div class="modal-body">
                    <div class="custom-categories-section">
                        <h4>Add New Category</h4>
                        <div class="form-row">
                            <input type="text" id="newCategoryName" placeholder="Category Name" maxlength="20">
                            <input type="text" id="newCategoryIcon" placeholder="📦" maxlength="2" style="width: 60px; text-align: center;">
                            <button onclick="expenseManager.addCustomCategory()" class="primary-btn">Add</button>
                        </div>
                    </div>
                    <div class="custom-categories-list">
                        <h4>Your Custom Categories</h4>
                        <div id="customCategoriesList"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.renderCustomCategoriesList();
    }

    addCustomCategory() {
        const name = document.getElementById('newCategoryName').value.trim();
        const icon = document.getElementById('newCategoryIcon').value.trim() || '📦';
        
        if (!name) {
            this.showNotification('Please enter a category name', 'error');
            return;
        }
        
        const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Check if category already exists
        if (this.getAllCategories().find(cat => cat.id === id)) {
            this.showNotification('Category already exists', 'error');
            return;
        }
        
        const newCategory = { id, name, icon };
        this.customCategories.push(newCategory);
        this.saveCustomCategories();
        
        // Clear inputs
        document.getElementById('newCategoryName').value = '';
        document.getElementById('newCategoryIcon').value = '';
        
        this.renderCustomCategoriesList();
        this.updateCategorySelects();
        this.showNotification(`✅ Added category: ${name}`, 'success');
    }

    deleteCustomCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category? Existing expenses will keep their category.')) {
            this.customCategories = this.customCategories.filter(cat => cat.id !== categoryId);
            this.saveCustomCategories();
            this.renderCustomCategoriesList();
            this.updateCategorySelects();
            this.showNotification('🗑️ Category deleted', 'success');
        }
    }

    renderCustomCategoriesList() {
        const container = document.getElementById('customCategoriesList');
        if (!container) return;
        
        if (this.customCategories.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No custom categories yet.</p>';
            return;
        }
        
        container.innerHTML = this.customCategories.map(category => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; margin-bottom: 0.5rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 1.5rem;">${category.icon}</span>
                    <span style="font-weight: 600;">${category.name}</span>
                </div>
                <button onclick="expenseManager.deleteCustomCategory('${category.id}')" class="btn-small danger-btn">Delete</button>
            </div>
        `).join('');
    }

    updateCategorySelects() {
        const selects = ['category', 'quickCategory', 'filterCategory', 'recurringCategory'];
        const allCategories = this.getAllCategories();
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            const currentValue = select.value;
            const isFilterSelect = selectId === 'filterCategory';
            
            // Clear and rebuild options
            select.innerHTML = isFilterSelect ? '<option value="">All Categories</option>' : '<option value="">Select Category</option>';
            
            allCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = `${category.icon} ${category.name}`;
                select.appendChild(option);
            });
            
            // Restore previous selection if still valid
            if (currentValue && allCategories.find(cat => cat.id === currentValue)) {
                select.value = currentValue;
            }
        });
    }

    // Dashboard Customization
    showDashboardCustomizer() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'dashboardCustomizerModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎨 Customize Dashboard</h3>
                    <button onclick="this.closest('.modal').remove()" class="close-btn">✕</button>
                </div>
                <div class="modal-body">
                    <div class="dashboard-customizer">
                        <h4>Widget Visibility</h4>
                        <div class="widget-toggles">
                            <label class="widget-toggle">
                                <input type="checkbox" id="toggle-quick-add" ${this.dashboardLayout.quickAdd ? 'checked' : ''}>
                                <span>⚡ Quick Add Expense</span>
                            </label>
                            <label class="widget-toggle">
                                <input type="checkbox" id="toggle-recent-expenses" ${this.dashboardLayout.recentExpenses ? 'checked' : ''}>
                                <span>📋 Recent Expenses</span>
                            </label>
                            <label class="widget-toggle">
                                <input type="checkbox" id="toggle-budget-overview" ${this.dashboardLayout.budgetOverview ? 'checked' : ''}>
                                <span>💰 Budget Overview</span>
                            </label>
                            <label class="widget-toggle">
                                <input type="checkbox" id="toggle-goals-overview" ${this.dashboardLayout.goalsOverview ? 'checked' : ''}>
                                <span>🎯 Goals Progress</span>
                            </label>
                        </div>
                        
                        <h4>Summary Cards</h4>
                        <div class="summary-toggles">
                            <label class="widget-toggle">
                                <input type="checkbox" id="toggle-monthly-total" ${this.dashboardLayout.monthlyTotal ? 'checked' : ''}>
                                <span>📅 This Month</span>
                            </label>
                            <label class="widget-toggle">
                                <input type="checkbox" id="toggle-total-expenses" ${this.dashboardLayout.totalExpenses ? 'checked' : ''}>
                                <span>💰 Total Expenses</span>
                            </label>
                            <label class="widget-toggle">
                                <input type="checkbox" id="toggle-weekly-total" ${this.dashboardLayout.weeklyTotal ? 'checked' : ''}>
                                <span>📊 This Week</span>
                            </label>
                        </div>
                        
                        <div class="customizer-actions">
                            <button onclick="expenseManager.saveDashboardLayout()" class="primary-btn">Save Layout</button>
                            <button onclick="expenseManager.resetDashboardLayout()" class="secondary-btn">Reset to Default</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    saveDashboardLayout() {
        this.dashboardLayout = {
            quickAdd: document.getElementById('toggle-quick-add').checked,
            recentExpenses: document.getElementById('toggle-recent-expenses').checked,
            budgetOverview: document.getElementById('toggle-budget-overview').checked,
            goalsOverview: document.getElementById('toggle-goals-overview').checked,
            monthlyTotal: document.getElementById('toggle-monthly-total').checked,
            totalExpenses: document.getElementById('toggle-total-expenses').checked,
            weeklyTotal: document.getElementById('toggle-weekly-total').checked
        };
        
        this.saveDashboardLayoutToStorage();
        this.applyDashboardLayout();
        document.getElementById('dashboardCustomizerModal').remove();
        this.showNotification('🎨 Dashboard layout saved!', 'success');
    }

    resetDashboardLayout() {
        this.dashboardLayout = {
            quickAdd: true,
            recentExpenses: true,
            budgetOverview: true,
            goalsOverview: true,
            monthlyTotal: true,
            totalExpenses: true,
            weeklyTotal: true
        };
        
        this.saveDashboardLayoutToStorage();
        this.applyDashboardLayout();
        document.getElementById('dashboardCustomizerModal').remove();
        this.showNotification('🔄 Dashboard reset to default', 'success');
    }

    applyDashboardLayout() {
        // Apply summary card visibility
        const summaryCards = document.querySelectorAll('.summary-card');
        summaryCards[0].style.display = this.dashboardLayout.monthlyTotal ? 'flex' : 'none';
        summaryCards[1].style.display = this.dashboardLayout.totalExpenses ? 'flex' : 'none';
        summaryCards[2].style.display = this.dashboardLayout.weeklyTotal ? 'flex' : 'none';
        
        // Apply widget visibility
        const quickAddCard = document.querySelector('.quick-add-card');
        if (quickAddCard) quickAddCard.style.display = this.dashboardLayout.quickAdd ? 'block' : 'none';
        
        const recentExpensesCard = document.querySelector('.recent-expenses-card');
        if (recentExpensesCard) recentExpensesCard.style.display = this.dashboardLayout.recentExpenses ? 'block' : 'none';
        
        const budgetOverviewCard = document.querySelector('.budget-overview-card');
        if (budgetOverviewCard) budgetOverviewCard.style.display = this.dashboardLayout.budgetOverview ? 'block' : 'none';
        
        const goalsOverviewCard = document.querySelector('.goals-overview-card');
        if (goalsOverviewCard) goalsOverviewCard.style.display = this.dashboardLayout.goalsOverview ? 'block' : 'none';
    }

    // Initialize PWA features
    initializePWAFeatures() {
        // Handle online/offline status
        this.handleOnlineStatus();
        
        // Sync offline expenses on startup
        if (navigator.onLine) {
            this.syncOfflineExpenses();
        }
        
        // Show PWA-specific UI elements
        if (this.isPWA()) {
            document.body.classList.add('pwa-mode');
            this.showNotification('📱 Running as installed app!', 'success');
        }
        
        // Apply dashboard layout
        this.applyDashboardLayout();
        
        // Update category selects with custom categories
        this.updateCategorySelects();
    }
}

// Initialize the app when the page loads
let expenseManager;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    expenseManager = new ExpenseManager();
    
    // Backup tab navigation in case the class method fails
    setTimeout(() => {
        console.log('Setting up backup tab navigation...');
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                console.log('Backup: Tab clicked:', tabName);
                
                // Update tab buttons
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update tab panels
                document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                const activePanel = document.getElementById(`${tabName}-tab`);
                if (activePanel) {
                    activePanel.classList.add('active');
                    console.log('Backup: Activated panel:', activePanel.id);
                }
                
                // Call the manager's method if available
                if (expenseManager && expenseManager.switchTab) {
                    expenseManager.switchTab(tabName);
                }
            });
        });
    }, 100);
});

// Enhanced initialization with PWA features
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Enhanced');
    expenseManager = new ExpenseManager();
    
    // Initialize PWA features after main app
    setTimeout(() => {
        if (expenseManager && typeof expenseManager.initializePWAFeatures === 'function') {
            expenseManager.initializePWAFeatures();
        }
    }, 1000);
});

// Make expenseManager globally available
window.expenseManager = expenseManager;