const inquirer = require('inquirer');

class CLI{
    constructor(){
        
    }
    run(){
        return inquirer
            .prompt(
                [
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
                    },
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