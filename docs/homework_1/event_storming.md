## Процессы системы:

1. Авторизация пользователя.

    ```tsx
    actor: 'user' | 'manager' | 'admin' | 'accounter'
    command: 'auth_user'
    data: { 
    	email: string; 
    	password: string; 
    }
    event: User.authorized
    ```

2. Создание задачи - любой пользователь.

    ```tsx
    actor: 'user' | 'manager' | 'admin' | 'accounter'
    command: 'create_task'
    data: { 
    	title: string;
    	status: 'open' | 'done'
    	assignee: User
    }
    event: Task.created
    ```

3. Распределение задач - manager, admin.

    ```tsx
    actor: 'manager' | 'admin' 
    command: 'reassign_tasks'
    data: { 
    	users: User[];
    	tasks: Task[];
    }
    event: Task.userAssigned
    ```

4. Получение списка задач пользователя - user.

    ```tsx
    actor: 'user'
    command: 'getting_tasks'
    data: { 
    	tasks: Task[];
    }
    event: User.tasksReceived
    ```

5. Выполнение задачи - user.

    ```tsx
    actor: 'user'
    command: 'close_task'
    data: { 
    	taskId: string;
    }
    event: Task.statusChanged
    ```

6. Получение списка транзакций пользователя - user

    ```tsx
    actor: 'user'
    command: 'getting_transactions'
    data: { 
    	transactions: Transaction[];
    }
    event: User.transactionsReceived
    ```

7. Получение количества заработанных топ-менеджментом за сегодня денег - admin

    ```tsx
    actor: 'admin'
    command: 'getting_balance'
    data: { 
    	amount: number;
    }
    event: Admin.balanceReceived
    ```

8. Получения статистики заработанных денег по дням - admin

    ```tsx
    actor: 'admin'
    command: 'getting_statistics'
    data: { 
    	statistic: { day: Date; amount: number; }[];
    }
    event: Admin.statisticsReceived
    ```

9. Выплата заработанных денег пользователю - event (end of day)

    ```tsx
    actor: System.event.endOfDay
    command: 'salary_payments'
    data: { 
    	userId: string;
    	amount: number;
    }
    event: User.salarySent
    ```

10. Отправка письма пользователю с суммой выплат - event (end of day). После выплаты, баланс пользователя обнуляется.

    ```tsx
    actor: User.salarySended
    command: 'sending_email_notification'
    data: { 
    	userId: string;
    	amount: number;
    	email: string;
    }
    event: User.emailSent
    ```

11. Создание транзакции выплаты

    ```tsx
    actor: User.salarySended
    command: 'sending_salary_transaction'
    data: { 
    	userId: string;
    	amount: number;
    	email: string;
    }
    event: User.transactionSent
    ```

12. Отображение количества пользователей с минусовым балансом. - admin

    ```tsx
    actor: 'admin'
    command: 'getting_users_with_negative_balance'
    data: { 
    	users: User[];
    }
    event: Admin.loosersReceived
    ```

13. Отображение самой дорогой задачи за день

    ```tsx
    actor: 'admin'
    command: 'getting_expensive_day_task'
    data: { 
    	task: Task;
    }
    event: Admin.expensiveDayTaskReceived
    ```

14. Отображение самой дорогой задачи за неделю

    ```tsx
    actor: 'admin'
    command: 'getting_expensive_week_task'
    data: { 
    	task: Task;
    }
    event: Admin.expensiveWeekTaskReceived
    ```

15. Отображение самой дорогой задачи за месяц
    ```tsx
    actor: 'admin'
    command: 'getting_expensive_month_task'
    data: {
    task: Task;
    }
    event: Admin.expensiveMonthTaskReceived
    ```