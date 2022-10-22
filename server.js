const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const { filter } = require('rxjs');

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
            choices: ['View All Departments', 'Add Department', 'View all roles', 'Add role', 'View Employees', 'Add employee']
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
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        const arr = rows.map(dept => dept.id);

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
                choices: rows
            }
        ])
            .then(data => {
                const sql = `INSERT INTO roles (title, salary, department_id)
        VALUES (?,?,?)`;
                const params = [data.title, data.salary, arr];
                db.query(sql, params, (err, rows) => {
                    if (err) console.log(err);
                    console.log('Role added')
                    //console.table(data)
                    dataChoices();
                });
            })
    });
}

function viewEmployees() {
    //mysql query to get all employees
    const sql = `SELECT * FROM employees JOIN roles ON employees.role_id = roles.id`;
    db.query(sql, (err, rows) => {
        console.table(rows)
        dataChoices();
    });
}

function addEmployees() {
    const sql = `SELECT * FROM roles`;

    db.query(sql, (err, res) => {
        // const arr = rows.map(dept => dept.id);
        return inquirer.prompt([
            {
                name: 'first_name',
                message: 'Employees first name?',
            }, {
                name: 'last_name',
                message: 'Employees last name?',
            }, {
                name: 'manager',
                message: 'Manager the employee will report to?',
            }
        ])
            .then(data => {
                const sql = `INSERT INTO employees (first_name, last_name, manager)
        VALUES (?,?,?)`;
                const params = [data.first_name, data.last_name, data.manager];
                db.query(sql, params, (err, res) => {
                    if (err) console.log(err);
                    console.log('Employee added')
                    console.table(data)
                    dataChoices();
                });
            })
    });
}

init()

