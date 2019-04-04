const {app, BrowserWindow} = require('electron');
const electron = require('electron');
const path = require('path');
const url = require('url');

///////////////////////////////////

const fs = require('fs');
const os = require('os');
const ipc = electron.ipcMain;
const shell = electron.shell;

let db = {};
///nedb configuration
let Datastore = require('nedb');
db.members = new Datastore({filename: 'members.db', autoload: true});
db.transactions = new Datastore({filename: 'transactions.db', autoload: true});


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1450,
    height: 800,
    minWidth: 1350,
    minHeight: 800
  });

  // load the dist folder from Angular
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/CityBazar/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  //set the title of the application
  app.setName('IT Database');

  // Open the DevTools optionally:
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});
ipc.on('print-to-pdf', function (event) {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf');
  const win = BrowserWindow.fromWebContents(event.sender);
  win.webContents.printToPDF({}, function (error, data) {
    if (error) {
      console.log(error.message);
    }
    else {
      fs.writeFile(pdfPath, data, function (err) {
        if (err) {
          event.sender.send('error', err);
        }
        else {
          shell.openExternal('file://' + pdfPath);
          event.sender.send('wrote-pdf', pdfPath);
        }
      })
    }
  })
});

/*-----------------------Members Query----------------------*/


/*---Generate Member ID---*/
ipc.on('generate-member-id', function (event) {
  db.members.count({}, function (err, count) {
    if (err) {
      event.sender.send('error')
    }
    else {
      event.sender.send('generated-member-id', count + 1)
    }
  })
});

/*---Get Members---*/
ipc.on('get-members', function (event) {
  // You can sort in reverse order like this
  db.members.find({}).sort({Id: 1}).exec(function (err, docs) {
    // If no document is found, docs is equal to []
    if (err) {
      event.sender.send('error')
    }
    else {
      event.sender.send('set-members', docs)
    }
  });
});

/*---Get Member By ID*/
ipc.on('get-member-by-id', function (event, id) {
  // The same rules apply when you want to only find one document
  db.members.findOne({Id: id}, function (err, doc) {
    if (err) {
      event.sender.send('error', err)
    }
    else {
      event.sender.send('set-member-by-id', doc)
    }
    // If no document is found, doc is null
  });
});


/*---Insert Member---*/
ipc.on('insert-member', function (event, member) {
  db.members.insert(member, function (err, newDoc) {
    if (err) {
      //emit an error event that something is wrong.
      event.sender.send('save-error', err)
    }
    else {
      event.sender.send('save-success')
    }
  })
});

/*---Update Member---*/
ipc.on('update-member', function (event, member) {
  db.members.update({Id: member.Id},
    {
      $set: {
        "Name": member.Name,
        "Address": member.Address
      }
    }, {}, function (err, rep) {
      if (err) {
        event.sender.send('update-error', err)
      }
      else {
        event.sender.send('update-success')
      }
    });
});

/*---Update Member Point----*/
ipc.on('update-member-point', function (event, members) {
  for (let i = 0; i < members.length; i++) {
    db.members.update({Id: members[i].Id},
      {
        $set: {
          "BuyPoint": members[i].BuyPoint,
          "ReferencePoint": members[i].ReferencePoint,
          "Point": members[i].Point,
          "TotalPoint": members[i].TotalPoint
        }
      }, {}, function (err, rep) {
        if (err) {
          event.sender.send('update-error', err)
        }
      });
  }
  event.sender.send('update-success')
});

/*---Remove Member---*/
ipc.on('remove-member', function (event, id) {
  db.members.remove({Id: id}, {}, function (err, numRemoved) {
    if (err) {
      event.sender.send('remove-error', err);
    }
    else {
      event.sender.send('remove-success');
    }
  });
});


/*-----------------------Transactions Query----------------------*/


/*---Get Transactions---*/
ipc.on('get-transactions', function (event) {
  // You can sort in reverse order like this
  db.transactions.find({}).sort({Date: 1}).exec(function (err, docs) {
    // If no document is found, docs is equal to []
    if (err) {
      event.sender.send('error')
    }
    else {
      event.sender.send('set-transactions', docs)
    }
  });
});

/*---Insert Transactions---*/
ipc.on('insert-transactions', function (event, transactions) {
  db.transactions.insert(transactions, function (err, newDoc) {
    if (err) {
      //emit an error event that something is wrong.
      event.sender.send('save-error', err)
    }
    else {
      event.sender.send('save-success', newDoc)
    }
  })
});
