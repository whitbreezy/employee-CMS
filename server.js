const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');


// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    password: 'Datagirl420',
    database: 'cms_db'
  },
  console.log(`Connected to the cms_db database.`)
);

const run = () => {
    inquirer
        .prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
                }
            ])
            .then((answer) => {
                
                if (answer.action == 'View all departments'){
                    return viewDepartments();
                }else if(answer.action === "View all roles"){
                    viewRoles();
                }else if (answer.action === "View all employees"){
                    viewEmployees();
                }else if (answer.action === "Add a department"){
                    addDepartment();
                }else if (answer.action === "Add a role"){
                    addRole();
                }else if (answer.action === "Add an employee"){
                    addEmployee();
                }else if (answer.action === "Update an employee role"){
                    updateEmployeeRole();
                } else return;
            })
};

const viewDepartments = () => {
    const sql = `SELECT departments.id AS id, departments.name AS department from departments`;

    db.query(sql, (err, result) => {
        if (err){
            console.log(err);
            return;
        }
        console.table(result);
        return run();
    });
};
const viewRoles = () => {
    const sql = `SELECT roles.id AS id, roles.title AS title, roles.salary AS salary, roles.department_id AS dept from roles`;

    db.query(sql, (err, result) => {
        if (err){
            console.log(err);
            return;
        }
        console.table(result);
        return run();
    });
};
const viewEmployees = () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title
    FROM employees
    JOIN roles ON employees.role_id = roles.id`
    db.query(sql, (err, result) => {
        if (err){
            console.log(err);
            return;
        }
        console.table(result);
        return run();
    });
};
const addDepartment = () => {
    inquirer
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
                console.table(result);
                viewDepartments();
                return run();
            });
        })
};
const addRole = () => {
    
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
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

            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, (SELECT id FROM departments WHERE name = ?))`;
            const params = [answers.roleName, answers.roleSalary, answers.roleDept];
            db.query(sql, params,(err, result) => {
                if (err){
                    console.log(err);
                    return;
                }
                return viewRoles();
            });
        })
};
const addEmployee = () => {
    inquirer
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
                name: 'manager_id',
                message: 'Enter employee manager id',
            },
        ])
        .then((answers)=>{
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, (SELECT id FROM roles WHERE title = ?), ?)`;
            const params = [answers.employee_first, 
            answers.employee_last,
            answers.employee_role, 
            answers.manager_id]
            
            db.query(sql, params, (err, result) => {
                if (err){
                    console.log(err);
                    return;
                }
                console.table(result);
                viewEmployees();
                run();
            });
        })
};
const updateEmployeeRole = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'updateID',
            message: 'Enter Employee ID whose role you want to update',
        },
        {
            type: 'input',
            name: 'updatedRole',
            message: 'Enter new role id for employee'
        },
    ])
    .then((answers)=>{
        
        const sql = `UPDATE employees SET role_id = ? WHERE employees.id = ?`;
        const params = [answers.updateID, answers.updatedRole]
        
        db.query(sql, params, (err, result) => {
            if (err){
                console.log(err);
                return;
            }
            console.table(result);
            viewEmployees();
            
        });
    })
};

run();
