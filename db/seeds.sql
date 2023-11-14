INSERT INTO departments(name)
VALUES ("Marketing"),
        ("Sales"),
        ("Customer Service"),
        ("IT"),
        ("Finance");

INSERT INTO roles(title, salary, department_id)
VALUES ("Marketing Specialist I", 75000.00, 1),
        ("Marketing Manager", 90000.00, 1),
        ("Graphic Designer", 75000.00, 1),
        ("Sales Manager", 95000.00, 2),
        ("External Sales Specialist", 90000.00, 2),
        ("Phone Representative", 50000.00, 3),
        ("Chat Representative", 50000.00, 3),
        ("Customer Service Manager", 70000.00, 3),
        ("Software Engineer", 100000.00, 4),
        ("QA Engineer", 95000.00, 4),
        ("Engineering Manager", 120000.00, 4),
        ("UX Designer", 90000.00, 4),
        ("Finance Manager", 100000.00, 5),
        ("Accountant", 90000.00, 5);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Adriana", "LaCerva", 1, 2),
        ("Carmela", "Soprano", 2, NULL),
        ("Meadow", "Soprano", 3, 2),
        ("Tony", "Soprano", 4, NULL),
        ("Silvio", "Dante", 5, 4),
        ("AJ", "Soprano", 6, 8),
        ("Christopher", "Moltisanti", 7, 8),
        ("Paulie", "Gualtieri", 8, NULL),
        ("Furio", "Giunta", 9, 11),
        ("Vito", "Spatafore", 10, 11),
        ("Bobby", "Baccala", 11, NULL),
        ("Jennifer", "Melfi", 12, 11),
        ("John", "Sacrimoni", 13, NULL),
        ("Phil", "Leotardo", 14, 13);
        

