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
    addDepartment(){};
    addRole(){};
    addEmployee(){};
    updateEmployeeRole(){};






                    //if user selects add dept from actions, then it asks for the dept name
                    {
                        type: 'input',
                        name: 'newDept',
                        message: 'Enter Department Name',
                        when: (answers) => answers['action'] === 'Add a department'
                    },
                    //if user selects add role from actions, then it asks for the role name, salary, and department
                    {
                        type: 'input',
                        name: 'newRole',
                        message: 'Enter Role Name',
                        when: (answers) => answers['action'] === 'Add a role'
                    },
                    {
                        type: 'input',
                        name: 'newRoleSalary',
                        message: 'Enter role Salary',
                        when: (answers) => answers['newRole']
                    },
                    {
                        type: 'input',
                        name: 'newRoleDept',
                        message: 'Enter role department',
                        when: (answers) => answers['newRoleSalary']
                    },
                    //if user selects ad an employee, it will ask for their first name, last name, role, manager
                    {
                        type: 'input',
                        name: 'newEmployeeFirst',
                        message: 'Enter employee first name',
                        when: (answers) => answers['action'] === 'Add an employee'
                    },
                    {
                        type: 'input',
                        name: 'newEmployeeLast',
                        message: 'Enter employee last name',
                        when: (answers) => answers['newEmployeeFirst']
                    },
                    {
                        type: 'input',
                        name: 'newEmployeeRole',
                        message: 'Enter employee role',
                        when: (answers) => answers['newEmployeeLast']
                    },
                    {
                        type: 'input',
                        name: 'newEmployeeManager',
                        message: 'Enter employee manager',
                        when: (answers) => answers['newEmployeeRole']
                    },
                    //if user selects update employee from actions, show list of employees to select and give them a new role 
                    {
                        type: 'list',
                        name: 'updateEmployee',
                        message: 'Which employee would you like to update?',
                        //choices: need to create a variable that grabs employees from database and reference it here
                        when: (answers) => answers['action'] === 'Update an employee'
                    },
                    {
                        type: 'input',
                        name: 'updatedRole',
                        message: 'Enter new role for employee',
                        when: (answers) => answers['updateEmployee']
                    },
                ]).then((data) => {
                    console.log(data)
                })
            }
    }