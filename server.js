const mysql2 = require('mysql2');
const inquirer = require('inquirer');

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
            choices: ['View All Departments', 'Add Department', 'View all roles', 'Add role']
        }
    ])
        .then(data => {
            switch (data.choice) {
                case 'View All Departments':
                    return viewAllDepartments();
                case 'Add Department':
                    return addDepartment()
                case 'View all roles':
                    return viewAllRole()
                case 'Add role':
                    return addRole()
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
    //mysql query to add department

}

function viewAllRole() {
    //mysql query to get all departments
    const sql = `SELECT * FROM roles JOIN departments ON roles.department_id = departments.id`;

    db.query(sql, (err, rows) => {
        console.table(rows)
        dataChoices();
    });
}

function addRole() {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
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
                message: 'departments',
                choices: rows
            }
        ])
            .then(data => {
                const sql = `INSERT INTO roles (title, salary, choice)
        VALUES (?)`;
                const params = [data.title, data.salary, data.choice];
                db.query(sql, params, (err, rows) => {
                    console.log('Role added')
                    dataChoices();
                });
            })
    });


}

init()

