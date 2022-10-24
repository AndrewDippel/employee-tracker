const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { listenerCount } = require('process');

const db = mysql2.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'password111',
        database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker database.`)
);

function init() {//function to initialize project
    dataChoices();
}
//function to display option or adding intern, engineer or finish building your team
function dataChoices() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'please select one of the following',
            choices: ['View All Departments', 'Add Department', 'View all roles', 'Add role', 'View Employees', 'Add Employees', 'Edit Employee role']
        }
    ])
        .then(data => {
            switch (data.choice) {
                case 'View All Departments':
                    return viewAllDepartments();
                case 'Add Department':
                    return addDepartment();
                case 'View all roles':
                    return viewAllRole();
                case 'Add role':
                    return addRole();
                case 'View Employees':
                    return viewEmployees();
                case 'Add Employees':
                    return addEmployees();
                case 'Edit Employee role':
                    return updateEmployeeRole();
            }
        })

}

function viewAllDepartments() {
    //mysql query to get all departments
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        console.table(rows)
        dataChoices();
    });
}

function addDepartment() {
    //mysql query to add department
    return inquirer.prompt([
        {
            name: 'department_name',
            message: 'please enter a department name',
        }
    ])
        .then(data => {
            const sql = `INSERT INTO departments (name)
        VALUES (?)`;
            const params = [data.department_name];
            db.query(sql, params, (err, rows) => {
                console.log('Department added')
                dataChoices();
            });
        })


}

function viewAllRole() {
    //mysql query to get all roles
    const sql = `SELECT * FROM roles JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        console.table(rows)
        dataChoices();
    });
}

function addRole() {
    //mysql query to add new role
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        return inquirer.prompt([
            {
                name: 'title',
                message: 'role title',
            }, {
                name: 'salary',
                message: 'role salary',
            }, {
                type: 'list',
                name: 'choice',
                message: 'role department',
                choices: departmentChoices
            }
        ])
            .then(data => {
                const sql = `INSERT INTO roles (title, salary, department_id)
        VALUES (?,?,?)`;
                const params = [data.title, data.salary, data.choice];
                db.query(sql, params, (err, rows) => {
                    if (err) console.log(err);
                    console.log('Role added')
                    dataChoices();
                });
            })
    });
}

function viewEmployees() {
    //mysql query to get all employees
    const sql = `SELECT * FROM employees JOIN roles ON employees.role_id = roles.id`;
    db.query(sql, (err, rows) => {
        if (err) console.log(err);
        console.table(rows)
        dataChoices();
    });
}

function addEmployees() {
    //mysql query to add new employees
    const sql = `SELECT * FROM roles, employees`;
    db.query(sql, (err, rows) => {
        const arr2 = rows.map(employee => employee.first_name)
        let employees = rows;
        const employeeList = employees.map(({ id, first_name }) => ({
            name: first_name,
            value: id
        }));
        const arr = rows.map(role => role.id)
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));
        return inquirer.prompt([
            {
                name: 'first_name',
                message: 'Employees first name?',
            }, {
                name: 'last_name',
                message: 'Employees last name?',
            }, {
                type: 'list',
                name: 'manager_id',
                message: 'please select the employees manager',
                choices: employeeList,
            }, {
                type: 'list',
                name: 'role_id',
                message: 'what role will this employee be under',
                choices: roleChoices,
            }
        ])
            .then(data => {
                const sql = `INSERT INTO employees (first_name, last_name, manager_id, role_id)
        VALUES (?,?,?,?)`;
                console.log(roleChoices);
                console.log(employeeList);

                let role_id = null;
                for (keyEl in arr) {
                    if (rows[keyEl].title === data.role) {
                        role_id = parseInt(keyEl) + 1
                    }
                }
                let manager_id = null;
                for (keyEl in arr2) {
                    if (rows[keyEl].first_name === data.first_name) {
                        manager_id = parseInt(keyEl) + 1
                    }
                }
                const params = [data.first_name, data.last_name, data.manager_id, data.role_id,];
                db.query(sql, params, (err, newEmp) => {
                    console.log(rows);
                    if (err) console.log(err);
                    console.log('Employee added')
                    //console.table(newEmp)
                    dataChoices();
                });
            })
            .catch(err => {
                console.error(err);
            })
    });
}

function updateEmployeeRole() {

    const sql = `SELECT * FROM employees, roles`;

    db.query(sql, (err, rows) => {

        const arr = rows.map(employee => employee.first_name)
        let employees = rows;
        const employeeList = employees.map(({ id, first_name }) => ({
            name: first_name,
            value: id
        }));


        const arr2 = rows.map(role => role.id)
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'what employee do you want to update?',
                choices: employeeList
            }, {
                type: 'list',
                name: 'roles',
                message: 'please select a new role',
                choices: roleChoices
            }
        ])
            .then(data => {
                const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                let role_id = null;
                for (keyEl in arr2) {
                    if (rows[keyEl].title === data.roles) {
                        role_id = parseInt(keyEl) + 1
                    }
                }
                let employee_id = null;
                for (keyEl in arr) {
                    if (rows[keyEl].first_name === data.employee) {
                        employee_id = parseInt(keyEl) + 1
                    }
                }
                const params = [role_id, employee_id];
                db.query(sql, params, (err, rows) => {
                    if (err) console.log(err);
                    console.log('Employee role updated')
                    dataChoices();
                });
            }
            )
    });
}


init()

