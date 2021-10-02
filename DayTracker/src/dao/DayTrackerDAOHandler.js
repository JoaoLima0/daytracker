//library 'pg' para node - conexão com o servidor pgAdmin
const { Client } = require('pg');
const phasher = require('./PHasher.js');
let instance;
instance = instance ?? null;
console.log("hg");
let connectedUser;
connectedUser = connectedUser ?? null;
console.log(connectedUser);


/*
DayTrackerDAOHandler - classe exportada, possui métodos para realizar querys de forma restrita
Cria uma nova instância do DAO sempre que faz uma query - conexão não fica aberta/exposta
Quando faz o login, armazena o usuário conectado para ser acessado para querys posteriores
*/
class DayTrackerDAOHandler {

  constructor(){
    console.log("DAOHandler constructor");
    console.log(connectedUser);
    this.randomThing = Math.round(Math.random()*1000);
  }

  disconnectUser(){
    connectedUser = null;
  }

  getConnectedUser(){
    console.log("Random thing: "+this.randomThing);
    return connectedUser;
  }

  async getAllTasks(callbackSuccess, callbackFail = function(){}){
    try{
      // console.log(connectedUser);
      if(connectedUser != null){
        let dao = new DayTrackerDAO();
        await dao.connect();
        const tasks = await dao.query(`SELECT taskid, userid, title, to_char(timestart, 'DD/MM/YYYY HH24:mi:ss') AS timestart, to_char(timefinish, 'DD/MM/YYYY HH24:mi:ss') AS timefinish, isfinished FROM task`);
        // console.log(tasks.rows);
        // console.log(tasks.rowCount);
        if(tasks.rowCount > 0) callbackSuccess(tasks.rows);
        else callbackFail();
        await dao.end();
        dao = null;
      } else callbackFail();
    }
    catch(err){
      throw err;
    }
  }

  async getAllUsers(callbackSuccess, callbackFail = function(){}){
    try{
      if(connectedUser != null && connectedUser.userid == 1){
        let dao = new DayTrackerDAO();
        await dao.connect();
        const users = await dao.query(`SELECT * FROM useraccount`);
        // console.log(users.rows);
        // console.log(users.rowCount);
        if(users.rowCount > 0) callbackSuccess(users.rows);
        else callbackFail();
        await dao.end();
        dao = null;
      } else callbackFail();
    }
    catch(err){
      throw err;
    }
  }

  async compareHashed(password, hashedPassword){
    return await phasher.compare(password, hashedPassword);
  }

  async login(username, password, callbackSuccess, callbackFail = function(){}){
    try{
      let dao = new DayTrackerDAO();
      await dao.connect();
      const results = await dao.query("SELECT userid, username, password FROM useraccount");
      //filtra array para obter apenas o usuário com o username e senha inseridos
      let userSuccess = results.rows.filter(userObj => {
        return (username === userObj.username)
      });
      let success = [];
      for(var i = 0; i < userSuccess.length; i++){
        if(await this.compareHashed(password, userSuccess[i].password)){
          success.push(userSuccess[i]);
        }
      }
      if(success.length > 0){
        //remove a senha do objeto antes de passá-lo na função de callback
        delete success[0].password;
        console.log("asdasd");
        console.log(connectedUser);
        connectedUser = success[0];
        console.log("AAAAAA");
        console.log(connectedUser);
        callbackSuccess(success[0]);
      } else callbackFail();
      await dao.end();
      dao = null;
    }
    catch(err){
      throw err;
    }
  }

  async createAccount(username, password, email, callbackSuccess, callbackFail = function(){}){
    try{
      let dao = new DayTrackerDAO();
      await dao.connect();
      //obtém uma id disponível
      const queryMaxId = await dao.query("SELECT MAX(userid) FROM useraccount");
      const userid = queryMaxId.rows[0].max + 1;
      const hashedPassword = await phasher.hash(password);
      const results = await dao.query(`INSERT INTO useraccount VALUES(${userid}, '${username}', '${password}', '${email}')`);
      if(results.rowCount > 0) callbackSuccess();
      else callbackFail();
      await dao.end();
      dao = null;
    }
    catch(err){
      throw err;
    }
  }

  async saveTask(data, callbackSuccess, callbackFail = function(){}){
    //Estado de desenvolvimento - conecta automaticamente ao usuário de id 1 para acelerar testes
    if(connectedUser == null) connectedUser = { userid: 1, username: 'user1' }; //DEVELOPMENT ONLY - Delete before build
    try{
      if(connectedUser != null) {
        let dao = new DayTrackerDAO();
        await dao.connect();
        let getNewTaskId = false;
        if('taskid' in data){
          //confere se a tarefa já existe para determinar se executará um INSERT ou UPDATE
          const queryTaskExists = await dao.query(`SELECT taskid FROM task WHERE userid=${connectedUser.userid} AND taskid=${data.taskid}`);
          if(queryTaskExists && queryTaskExists.rowCount > 0){
            const results = await dao.query(`UPDATE task SET title='${data.title}', timestart='${data.datetimeStart}', timefinish='${data.datetimeEnd}', isfinished='${data.isFinished}' WHERE taskid=${data.taskid}`);
            if(results && results.rowCount > 0) callbackSuccess();
            else callbackFail();
          } else getNewTaskId = true;
        } else getNewTaskId = true;
        if(getNewTaskId){
          //caso precise gerar uma nova tarefa id, gera uma id disponível
          const queryMaxId = await dao.query("SELECT MAX(taskid) FROM task");
          const newTaskId = queryMaxId.rows[0].max + 1;
          const results = await dao.query(`INSERT INTO task VALUES(${newTaskId}, ${connectedUser.userid}, '${data.title}', '${data.datetimeStart}', '${data.datetimeEnd}', '${data.isFinished}')`);
          if(results && results.rowCount > 0) callbackSuccess();
          else callbackFail();
        }
        await dao.end();
        dao = null;
      } else callbackFail();
    }
    catch(err){
      callbackFail();
      console.log(err);
    }
  }

  async getTasks(callbackSuccess, callbackFail = function(){}){
    //Estado de desenvolvimento - conecta automaticamente ao usuário de id 1 para acelerar testes
    try{
      if(connectedUser == null) {
        // console.log("wasNull");
        connectedUser = { userid: 1, username: 'user1' }; //DEVELOPMENT ONLY - Delete before build
      }
      if(connectedUser != null) {
        // console.log("TAAAAAAAAAA");
        let dao = new DayTrackerDAO();
        await dao.connect();
        const tasks = await dao.query(`SELECT taskid, userid, title, to_char(timestart, 'DD/MM/YYYY HH24:mi:ss') AS timestart, to_char(timefinish, 'DD/MM/YYYY HH24:mi:ss') AS timefinish, isfinished FROM task WHERE userid=${connectedUser.userid}`);
        // console.log("HERE:");
        // console.log(tasks.rows);
        // console.log(tasks.rowCount);
        if(tasks.rowCount >= 0) callbackSuccess(tasks.rows);
        else callbackFail();
        await dao.end();
        dao = null;
      } else callbackFail();
    }
    catch(err){
      callbackFail();
      console.log(err);
    }
  }


  async getResources(compTask, callbackSuccess, callbackFail = function(){}){
    //Estado de desenvolvimento - conecta automaticamente ao usuário de id 1 para acelerar testes
    try{
      if(connectedUser == null) {
        // console.log("wasNull");
        connectedUser = { userid: 1, username: 'user1' }; //DEVELOPMENT ONLY - Delete before build
      }
      if(connectedUser != null) {
        // console.log("TAAAAAAAAAA");
        let dao = new DayTrackerDAO();
        await dao.connect();
        const resources = await dao.query(`SELECT * FROM resource WHERE taskid=${compTask[0]}`);
        console.log("HERE:");
        console.log(resources.rows);
        console.log(resources.rowCount);
        if(resources.rowCount >= 0) callbackSuccess(resources.rows);
        else callbackFail();
        await dao.end();
        dao = null;
      } else callbackFail();
    }
    catch(err){
      callbackFail();
      console.log(err);
    }
  }


  async saveResource(data, callbackSuccess, callbackFail = function(){}){
    //Estado de desenvolvimento - conecta automaticamente ao usuário de id 1 para acelerar testes
    if(connectedUser == null) connectedUser = { userid: 1, username: 'user1' }; //DEVELOPMENT ONLY - Delete before build
    try{
      if(connectedUser != null) {
        let dao = new DayTrackerDAO();
        await dao.connect();
        if(!('resourceid' in data)){
          const queryMaxId = await dao.query("SELECT MAX(resid) FROM resource");
          const newResourceId = (queryMaxId.rows[0].max + 1) ?? 0;
          data.resourceid = newResourceId;
        }
        const results = await dao.query(`INSERT INTO resource VALUES(${data.resourceid}, ${data.taskid}, '${data.type}', '${data.name}', '${data.vals}') ON CONFLICT (resid) DO UPDATE SET name = '${data.name}', vals = '${data.vals}'`);
        // const results = await dao.query(`UPDATE task SET title='${data.title}', timestart='${data.datetimeStart}', timefinish='${data.datetimeEnd}', isfinished='${data.isFinished}' WHERE taskid=${data.taskid}`);
        // const results = await dao.query(`INSERT INTO task VALUES(${newTaskId}, ${connectedUser.userid}, '${data.title}', '${data.datetimeStart}', '${data.datetimeEnd}', '${data.isFinished}')`);
        if(results && results.rowCount > 0) callbackSuccess();
        else callbackFail();
        await dao.end();
        dao = null;
      } else callbackFail();
    }
    catch(err){
      callbackFail();
      console.log(err);
    }
  }





  async getTasksFromDay(day, callbackSuccess, callbackFail = function(){}){
    //Estado de desenvolvimento - conecta automaticamente ao usuário de id 1 para acelerar testes
    if(connectedUser == null) connectedUser = { userid: 1, username: 'user1' }; //DEVELOPMENT ONLY - Delete before build
    try{
      if(connectedUser != null) {
        let dao = new DayTrackerDAO();
        await dao.connect();
        const tasks = await dao.query(`SELECT taskid, userid, title, to_char(timestart, 'DD/MM/YYYY HH24:mi:ss') AS timestart, to_char(timefinish, 'DD/MM/YYYY HH24:mi:ss') AS timefinish, isfinished FROM task WHERE userid=${connectedUser.userid} AND (to_char(timestart, 'DD/MM/YYYY')='${day}' OR to_char(timefinish, 'DD/MM/YYYY')='${day}' OR ('${day}' BETWEEN timestart AND timefinish))`);
        console.log(tasks.rows);
        console.log(tasks.rowCount);
        if(tasks.rowCount >= 0) callbackSuccess(tasks.rows);
        else callbackFail();
        await dao.end();
        dao = null;
      } else callbackFail();
    }
    catch(err){
      callbackFail();
      console.log(err);
    }
  }


  //método para obter a instância utilizada do Handler
  //dessa forma não é preciso passar o handler entre os objetos do sistema
  static getInstance(){
    if(!instance){
      console.log("new instance");
      console.log(connectedUser);
      instance = new DayTrackerDAOHandler();
    }
    return instance;
  }

}



/*
DayTrackerDAO - Acessável apenas pelo Handler, lida com a conexão diretamente
*/
class DayTrackerDAO {

  constructor(){
    this.connection = new Client({
      user: "postgres",
      password: "", //notincluded
      host: "localhost",
      port: 1111, //notincluded
      database: "daytracker"
    });
    this.isConnected = false;
  }

  async connect(){
    // console.log("dao:connect");
    if(!this.isConnected){
      // console.log("dao:connect:ifTrue");
      try{
        // console.log("dao:connect:awaitConnection");
        await this.connection.connect();
        // console.log("dao:connect:connected");
        this.isConnected = true;
        return true;
      } catch(err){
        console.log(err);
      }
    } else {
      // console.log("dao:connect:ifFalse");
      return true;
    }
  }

  async query(command){
    try{
      // console.log("dao:query");
      const results = await this.connection.query(command);
      // console.log("dao:query:received");
      return results;
    } catch(err){
      console.log(err);
    }
  }

  async end(){
    await this.connection.end();
    this.isConnected = false;
    return;
  }
}


module.exports = DayTrackerDAOHandler;
