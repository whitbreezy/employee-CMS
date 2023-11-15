const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'Datagirl420',
    database: 'cms_db'
  },
  console.log(`Connected to the cms_db database.`)
);

class CLI{

    run(){
        return inquirer
            .prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
                    }
                ])
                .then((answer) => {
                    const choice = answer;
                    if (choice ==="View all departments"){
                        return this.viewDepartments();
                    }
                    if(choice === "View all roles"){
                        return this.viewRoles();
                    }
                    if (choice === "View all employees"){
                        return this.viewEmployees();
                    }
                    if (choice === "Add a department"){
                        return this.addDepartment();
                    }
                    if (choice === "Add a role"){
                        return this.addRole();
                    }
                    if (choice === "Add an employee"){
                        return this.addEmployee();
                    }
                    if (choice === "Update an employee role"){
                        return this.updateEmployeeRole();
                    }
                })
    };
    viewDepartments(){
        const sql = `SELECT departments.id AS id, departments.name AS department from departments`;

        db.query(sql, (err, result) => {
            if (err){
                console.log(err);
                return;
            }
            console.log(result);
            this.run();
        });
    };
    viewRoles(){
        const sql = `SELECT roles.id AS id, roles.title AS title, roles.salary AS salary, roles.department_id AS dept from roles`;

        db.query(sql, (err, result) => {
            if (err){
                console.log(err);
                return;
            }
            console.log(result);
            this.run();
        });
    };
    viewEmployees(){
        const sql = `SELECT employees.id, 
        employees.first_name, 
        employees.last_name, 
        roles.title, 
        departments.name AS dept, 
        roles.salary
        FROM employees, roles, departments 
        WHERE departments.id = roles.department_id 
        AND roles.id = employees.role_id
        ORDER BY employees.last_name ASC`;

        db.query(sql, (err, result) => {
            if (err){
                console.log(err);
                return;
            }
            console.log(result);
            this.run();
        });
    };
    addDepartment(){
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newDept',
                    message: 'Enter department name'
                },
            ])
            .then((answers)=>{
                const sql = `INSERT INTO departments (name)
                VALUES (?)`;

                db.query(sql, answers.newDept, (err, result) => {
                    if (err){
                        console.log(err);
                        return;
                    }
                    console.log(result);
                    this.run();
                });
            })
    };
    addRole(){
        
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newRole',
                    message: 'Enter Role Name',
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter role Salary',
                },
                {
                    type: 'input',
                    name: 'roleDept',
                    message: 'Enter role department',
                },
            ])
            .then((answers)=>{
                const sql = `INSERT INTO roles (department_id) SELECT id FROM departments WHERE name = (?);
                INSERT INTO roles (salary, title) VALUES (?, ?);`;
                const params = [answers.roleDept, answers.roleSalary, answers.newRole ]
                db.query(sql, params, (err, result) => {
                    if (err){
                        console.log(err);
                        return;
                    }
                    console.log(result);
                    this.run();
                });
            })
    };
    addEmployee(){
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'employee_first',
                    message: 'Enter employee first name',
                },
                {
                    type: 'input',
                    name: 'employee_last',
                    message: 'Enter employee last name',
                },
                {
                    type: 'input',
                    name: 'employee_role',
                    message: 'Enter employee role',
                },
                {
                    type: 'input',
                    name: 'manager_first',
                    message: 'Enter employee manager first name',
                },
                {
                    type: 'input',
                    name: 'manager_last',
                    message: 'Enter employee manager last name',
                },
            ])
            .then((answers)=>{
                const sql = `INSERT INTO employees (first_name, last_name) VALUES (?, ?);
                INSERT INTO employees (role_id) SELECT id FROM roles WHERE title = (?);
                INSERT INTO employees (manager_id) SELECT id FROM employees WHERE first_name = ?, last_name = ?`;
                const params = [answers.employee_first, 
                answers.employee_last,
                answers.employee_role, 
                answers.manager_first,
                answers.manager_last]
                
                db.query(sql, params, (err, result) => {
                    if (err){
                        console.log(err);
                        return;
                    }
                    console.log(result);
                    this.run();
                });
            })
    };
    updateEmployeeRole(){
        let employeeArray = [];
        let rolesArray = [];
        let employeeSQL = "SELECT employees.id, employees.first_name, employees.last_name FROM employees";
        let roleSQL = "SELECT roles.id, roles.title FROM roles";
        //query db for employee names
        db.query(employeeSQL, (err, results) =>{
            if (err){
                console.log(err)
            }results.forEach((employee)=>{
                employeeArray.push(`${employee.id} ${employee.first_name} ${employee.last_name}}`)
            })
        });
        //query db for role names
        db.query(roleSQL, (err, results) =>{
            if (err){
                console.log(err)
            }results.forEach((role)=>{
                rolesArray.push(`${role.title}`)
            })
        })

        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'updateEmployee',
                message: 'Which employee would you like to update?',
                choices: employeeArray
            },
            {
                type: 'input',
                name: 'updatedRole',
                message: 'Enter new role for employee',
                choices: rolesArray
            },
        ])
        .then((answers)=>{
            let employeeID;
            answers.forEach((employee)=>{
                if (answers.updateEmployee === `${employee.id} ${employee.first_name} ${employee.last_name}`){
                    employeeID = `${employee.id}`
                }
            })
            const sql = `UPDATE employees SET role_id = roles.id WHERE employees.id = ?`;
            
            db.query(sql, employeeID, (err, result) => {
                if (err){
                    console.log(err);
                    return;
                }
                console.log(result);
                this.run();
            });
        })
    }
};