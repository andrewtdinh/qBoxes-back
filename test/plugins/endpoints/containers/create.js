/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
// var Sinon = require('sinon');
var Server = require('../../../../lib/server');
// var Profile = require('../../../../lib/models/profile');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var beforeEach = lab.beforeEach;
var before = lab.before;
var after = lab.after;
var server;

describe('POST /profiles', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should create a new container', function(done){
    server.inject({method: 'POST', url: '/containers', credentials: {_id: 'abcdefabcdefabcdefabcde2'}, payload: {name: 'Brown UPS box', type: 'box', description: 'Contain stuff from the living room', owner: {$oid: 'abcdefabcdefabcdefabcde2'}, totalValue: 99.99, items: [], currentLocation: '', currentRoom: ''}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Brown UPS box');
      expect(response.result.type).to.equal('box');
      expect(response.result.items).to.have.length(0);
      done();
    });
  });
  // it('should return a 400', function(done){
  //   server.inject({method: 'POST', url: '/profiles', credentials: {firebaseId: 'a00000000000000000000001'}, payload: {firstName: 'a', lastName: 'dinh', photo: 'photostring', skills: ['Jade', 'Html'], exposure: ['a', 'b'], bio: 'Yeah', location: 'Fremont', interests: ['Nothing'], remote: true, relocate: false, locationPref: ['San Francisco'], education: 'Carleton', contact: {email: 'test@test.com'}, social: {github: 'mygitty'}}}, function(response){
  //     expect(response.statusCode).to.equal(400);
  //     done();
  //   });
  // });
});
