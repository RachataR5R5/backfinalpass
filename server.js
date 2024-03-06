require('dotenv').config();

const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

// connect to database
const db = new sqlite3.Database('./Database/workspace.sqlite');

// parse incoming requests
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS Employees (
    EmployeeID INTEGER PRIMARY KEY,
    Name TEXT,
    Position TEXT,
    DepartmentID INTEGER,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
)`)

db.run(`CREATE TABLE IF NOT EXISTS Departments (
    DepartmentID INTEGER PRIMARY KEY,
    Name TEXT , 
    EmployeeID INTEGER , 
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
)`)


db.run(`CREATE TABLE IF NOT EXISTS Projects (
    ProjectID INTEGER PRIMARY KEY,
    Name TEXT,
    DepartmentID INTEGER,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
)`)


db.run(`CREATE TABLE IF NOT EXISTS Tasks (
    TaskID INTEGER PRIMARY KEY,
    Description TEXT,
    EmployeeID INTEGER,
    ProjectID INTEGER,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID)
)`)

/////////////////////////////////////////////////////////////////
/// SHELVES

app.get("/Employee", (req, res) => {
    db.all('SELECT * FROM Employees', (err, row) => {
        if (err) res.status(500).send(err);
        else res.json(row)
    });
});

app.get("/Employee/:id", (req, res) => {
    db.get('SELECT * FROM Employees WHERE EmployeeID = ?', req.params.id, (err, row) => {
        if (err) res.status(500).send(err);
        else {
            if (!row) res.status(404).send("Shelve not found!!");
            else res.json(row)
        }
    });
});




app.post("/Employee", (req, res) => {
    const Employee = req.body;
    db.run('INSERT INTO Employees (Name , Position , DepartmentID ) VALUES (? , ? , ?)', Employee.Name , Employee.Position , Employee.DepartmentID , function(err) {
        if (err) res.status(500).send(err);
        else {
            Employee.id = this.lastID;
            res.send(Employee);
        }
    });
});

app.put("/Employee/:id", (req, res) => {
    const Employee = req.body;
    db.run('UPDATE Employees SET Name = ? , Position = ? , DepartmentID = ?  WHERE EmployeeID = ?', Employee.Name , Employee.Position , Employee.DepartmentID  , req.params.id, function(err) {
        if (err) res.status(500).send(err);
        else res.send(Employee);
    });
});

app.delete("/Employee/:id", (req, res) => {
    db.run('DELETE FROM Employees WHERE EmployeeID = ?', req.params.id, function(err) {
        if(err) { 
            res.status(500).send(err);
        }
        else {
            res.send("ลบข้อมูลเรียบร้อยแล้วครับ").status(200)
        }
    });

});


////////////////////////////////////// Department
app.get("/Departments", (req, res) => {
    db.all('SELECT * FROM Departments', (err, row) => {
        if (err) res.status(500).send(err);
        else res.json(row)
    });
});

app.get("/Departments/:id", (req, res) => {
    db.get('SELECT * FROM Departments WHERE DepartmentID = ?', req.params.id, (err, row) => {
        if (err) res.status(500).send(err);
        else {
            if (!row) res.status(404).send("Shelve not found!!");
            else res.json(row)
        }
    });
});
app.post("/Departments", (req, res) => {
    const Departments = req.body;
    db.run('INSERT INTO Departments (Name , EmployeeID) VALUES (? , ?)', Departments.Name, Departments.EmployeeID ,  function(err) {
        if (err) res.status(500).send(err);
        else {
            Departments.id = this.lastID;
            res.send(Departments);
        }
    });
});
app.put("/Departments/:id", (req, res) => {
    const Departments = req.body;
    db.run('UPDATE Departments SET Name = ? , EmployeeID = ?   WHERE DepartmentID = ?', Departments.Name,Departments.EmployeeID ,req.params.id , function(err) {
        if (err) res.status(500).send(err);
        else res.send(Departments);
    });
});
app.delete("/Departments/:id", (req, res) => {
    db.run('DELETE FROM Departments WHERE DepartmentID = ?', req.params.id, function(err) {
        if(err) { 
            res.status(500).send(err);
        }
        else {
            res.send("ลบข้อมูลเรียบร้อยแล้วครับ").status(200)
        }
    });

});

/////////////Task///////////////////
app.get("/Tasks", (req, res) => {
    db.all('SELECT * FROM Tasks', (err, row) => {
        if (err) res.status(500).send(err);
        else res.json(row)
    });
});

app.get("/Tasks/:id", (req, res) => {
    db.get('SELECT * FROM Tasks WHERE TaskID = ?', req.params.id, (err, row) => {
        if (err) res.status(500).send(err);
        else {
            if (!row) res.status(404).send("TASK NOT FOUND");
            else res.json(row)
        }
    });
});
app.post("/Tasks", (req, res) => {
    const Tasks = req.body;
    db.run('INSERT INTO Tasks (Description , EmployeeID ,ProjectID) VALUES (? , ? , ?)', Tasks.Description, Tasks.EmployeeID ,Tasks.ProjectID ,  function(err) {
        if (err) res.status(500).send(err);
        else {
            Tasks.id = this.lastID;
            res.send(Tasks);
        }
    });
});
app.put("/Tasks/:id", (req, res) => {
    const Tasks = req.body;
    db.run('UPDATE Tasks SET Description = ? , EmployeeID = ? , ProjectID = ?   WHERE TaskID = ?', Tasks.Description, Tasks.EmployeeID ,Tasks.ProjectID ,req.params.id, function(err) {
        if (err) res.status(500).send(err);
        else res.send(Tasks);
    });
});
app.delete("/Tasks/:id", (req, res) => {
    db.run('DELETE FROM Tasks WHERE TaskID = ?', req.params.id, function(err) {
        if(err) { 
            res.status(500).send(err);
        }
        else {
            res.send("ลบข้อมูลเรียบร้อยแล้วครับ").status(200)
        }
    });

});


///
/////////////Projects///////////////////
app.get("/Projects", (req, res) => {
    db.all('SELECT * FROM Projects', (err, row) => {
        if (err) res.status(500).send(err);
        else res.json(row)
    });
});

app.get("/Projects/:id", (req, res) => {
    db.get('SELECT * FROM Projects WHERE ProjectID = ?', req.params.id, (err, row) => {
        if (err) res.status(500).send(err);
        else {
            if (!row) res.status(404).send("TASK NOT FOUND");
            else res.json(row)
        }
    });
});
app.post("/Projects", (req, res) => {
    const Projects = req.body;
    db.run('INSERT INTO Projects (Name , DepartmentID) VALUES (? , ?)', Projects.Name, Projects.DepartmentID,  function(err) {
        if (err) res.status(500).send(err);
        else {
            Projects.id = this.lastID;
            res.send(Projects);
        }
    });
});
app.put("/Projects/:id", (req, res) => {
    const Projects = req.body;
    db.run('UPDATE Projects SET Name  = ? , DepartmentID = ?   WHERE ProjectID = ?', Projects.Name, Projects.DepartmentID  ,req.params.id, function(err) {
        if (err) res.status(500).send(err);
        else res.send(Projects);
    });
});
app.delete("/Projects/:id", (req, res) => {
    db.run('DELETE FROM Projects WHERE ProjectID = ?', req.params.id, function(err) {
        if(err) { 
            res.status(500).send(err);
        }
        else {
            res.send("ลบข้อมูลเรียบร้อยแล้วครับ").status(200)
        }
    });

});









app.listen(3000, () => { console.log(`Listening on port ${3000}`) })