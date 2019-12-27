const createConnection = require("typeorm").createConnection;
const getRepository = require("typeorm").getRepository;
const Account = require("../model/Models").Account;
const Member = require("../model/Models").Member;
const Saving = require("../model/Models").Saving;
const Balance = require("../model/Models").Balance;
const Borrowing = require("../model/Models").Borrowing;
const Finance = require("../model/Models").Finance;
const sha256 = require('crypto-js/sha256');
const sqlOptions=require('../sqlOptions');
let Repositories = {
    accountRepository: null,
    memberRepository: null,
    savingRepository: null,
    balanceRepository: null,
    borrowingRepository: null,
    financeRepository: null,
};
createConnection(sqlOptions)
    .then(async (connection) => {
        Repositories.accountRepository = getRepository(Account);
        Repositories.memberRepository = getRepository(Member);
        Repositories.savingRepository = getRepository(Saving);
        Repositories.balanceRepository = getRepository(Balance);
        Repositories.borrowingRepository = getRepository(Borrowing);
        Repositories.financeRepository = getRepository(Finance);
        // let accounts = await Repositories.accountRepository.find({
        //     relations: ['members']
        // });
        // console.log('accounts.length: ' + accounts.length);
        // console.log('accounts: ' + JSON.stringify(accounts, null, 2));
        let Ids=[2,3,4,4534];

        let members = await Repositories.memberRepository.findByIds(Ids,{relations: ['account']});
        // let members = await Repositories.memberRepository.find({
        //     account: {id: 2},
        //     // relations: ['account']
        // });
        console.log('members.length: ' + members.length);
        console.log('members: ' + JSON.stringify(members, null, 2));

        let dataList = await Repositories.savingRepository.find({
            member: {id: 7},
            // relations: ['member']
        });
        console.log('dataList.length: ' + dataList.length);
        console.log('dataList: ' + JSON.stringify(dataList, null, 2));
        return true
    })
    .catch((error) => {
        console.log('应用启动失败');
        console.log(error);
        return false
    });
//
// var string ='123';
// console.log(sha256(sha256(string+'@Hi1Vssic7&kEIWb').toString()+'c@QSK2*fpav939#F').toString());
