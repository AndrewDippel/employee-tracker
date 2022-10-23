use employee_tracker;
INSERT INTO departments(name)
VALUES ('Intern'),
        ('Engineers'),
        ('Office');

INSERT INTO roles(title, salary, department_id)
VALUES('front end', 90000, 2),
('back end', 95000, 2),
('dev lead', 110000, 2),
('reception', 80000, 3),
('junior front end', 70000, 1),
('junior back end', 70000, 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('Tim', 'Tam', 1, 3),
('Luffy', 'Monkey.D', 3, null),
('Escanor', 'Lion', 2, 3),
('Roronoa', 'Zoro', 1, 3),
('Asta', 'Staria', 4, null),
('Akame', 'Murasame', 6, 2),
('Robin', 'Nico', 5, 1),