# Описание системы

## Элементы системы:

1. Сервис маршрутизации
2. Сервис авторизации
3. Трекер задач
4. Сервис статистики заработанных денег
5. Сервис отправки писем
6. Сервис аналитики задач

# Возможности элементов:

## Сервис маршрутизации:

1. Должен принимать запрос от клиентских приложений
2. Должен проверять токен пользователя
3. Если токен валиден, должен переадресовывать пользователя в запрошенный сервис
4. Если токена нет или срок его действия истек, должен переадресовывать пользователя в сервис авторизации.

### Сущности сервиса маршрутизации:

Список соответствия сервисов:

```tsx
type ServiceMapping = {
	[serviceName: string]: string; //service address
}
```

## Сервис авторизации:

1. Должен принимать логин и пароль пользователя
2. Должен выдавать access_token пользователю если логин и пароль совпали.
3. В токене должна быть роль пользователя
4. Токен должен иметь срок действия

### Сущности сервиса авторизации:

Пользователь:

```tsx
type User = {
	id: string;
	email: string;
	password: string;
}
```

Токен:

```tsx
enum UserRole {
	Admin,
	Manager,
	User
}

type JwtPayload = {
	exp: Date;
	role: UserRole;
	userId: string;
}
```

## Трекер задач:

1. Пользователь должен иметь возможность создать задачу
2. Пользователь с ролью Администратор или Менеджер, должны иметь возможность распределить все задачи без исполнителей одной кнопкой “Распределить задачи”.
3. Назначить исполнителя можно только кнопкой из п.2
4. Пользователь с ролью Администратор или Менеджер не может быть исполнителем задачи.
5. Логика функционала “Распределить задачи” должна работать следующим образом:
    1. Получить список всех задач в статусе open
    2. Получить список всех пользователей системы, кроме пользователей с ролью Администратор или Менеджер
    3. Взять первую задачу из списка и присвоить рандомного исполнителя из списка пользователей
    4. Повторить пункт c, пока список задач не кончится
6. При создании задачи, нужно рандомно выбирать исполнителя.
7. При нажатии кнопки “Распределить задачи”, нужно менять исполнителей так же рандомно.
8. Каждый раз, при создании задачи, сервис должен отправлять сообщение в Kafka с id задачи и id назначенного пользователя. Эта информация будет использоваться сервисом учета финансов.

### Сущности трекера задач:

Задача:

```tsx
type Task = {
	id: string;
	title: string;
	description: string;
	status: 'open' | 'done';
}
```

Пользователь:

```tsx
enum UserRole {
	Admin,
	Manager,
	User
}

type User = {
	id: string;
	name: string;
	role: UserRole;
	balance: number;
	email: string;
}
```



## Учет финансов

1. Учет должен быть в отдельном дашборде.
2. У пользователей с ролью Администратор или Бухгалтер, должен быть доступ ко всем данным.
    1. Дашборд администратора отображает количество заработанных топ-менеджментом за сегодня денег и статистику по дням.
3. У пользователей с ролью Пользователь, должен быть доступ только к своей статистики.
    1. Дашборд пользователя отображает Историю и текущий баланс пользователя.
4. У каждого сотрудника есть свой счет с историей транзакций (поступление и списание)
5. Когда задача назначается на сотрудника, с его баланса, в пользу менеджмента, списывается рандомная сумма в диапазоне от 10 до 20$ включительно.
6. Когда сотрудник закрывает задачу, с баланса менеджмента, в пользу пользователя, списывается рандомная сумма в диапазоне от 20 до 40$ включительно.
7. Отрицательный баланс пользователя переносится на следующий день. Положительный баланс выплачивается пользователю в конце дня. В Истории должна отображаться запись о выплате. После выплаты, баланс пользователя обнуляется.
8. Сервис должен выводить количество заработанных денег менеджментом по формуле:  `((sum(completed task amount) - sum(assigned task fee)) * -1`
9. Сервис, в конце рабочего дня, должен расчитывать количество денег заработанных за день пользователем.
10. Дашборд должен выводить информацию по дням, а не за весь период сразу. (Можно только за текущий день)
11. При создании транзакции, сервис должен отправлять сообщение в kafka. Данные о транзакциях будет использовать сервис аналитики.

### Сущности сервиса учета финансов

Транзакция:

```tsx
type Transaction = {
	id: string;
	amount: number; //can be positive or negative
	userId: string; // relative to user
	created_at: Date;
}
```

Баланс компании:

```tsx
type CompanyAccount = {
	amount: number;
}
```

## Сервис отправки писем

1. Сервис,  должен принимать список пользователей, сообщений и email.
2. В конце каждого дня, сервис должен рассылать сообщения пользователям из списка.

### Сущности сервиса отправки писем:

Шаблон письма:

```tsx
type EmailTemplate = {
	from: string;
	to: string;
	subject: string;
	message: string; 
}
```

## Сервис аналитики

1. Сервис доступен только пользователям с ролью Администратор
2. Сервис должен иметь отдельный Дашборд
3. Сервис должен отображать сколько заработал менеджмент за день
4. Сервис должен отображать количество пользователей, которые ушли в минус
5. Сервис должен отображать самую дорогую задачу за день, неделю, месяц.
    1. самой дорогой задачей является задача с наивысшей ценой из списка всех закрытых задач за определенный период времени
    2. пример того, как это может выглядеть: