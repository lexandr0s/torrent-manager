const fetch = require('node-fetch');
const config = require('../../config');
const log = require('../middleware/log');

const lastData = {
    userBtfsBalance: 0,
    userBttBalance: 0,
    smartContractBttBalance: 0,
}

const getUserBtfsBalance = async () => {
    const {
        BtfsWalletBalance: userBtfsBalance,
        BttWalletBalance: userBttBalance,
    } = await fetch(`http://127.0.0.1:${config.autoBttTransfer.port}/api/v1/wallet/balance`, {method: 'POST'})
        .then(res => res.json());
    if (!userBtfsBalance) return -1;

    if (lastData.userBtfsBalance !== userBtfsBalance || lastData.userBttBalance !== userBttBalance) {
        lastData.userBtfsBalance = userBtfsBalance;
        lastData.userBttBalance = userBttBalance;
        log.balance('IN-APP:', userBtfsBalance, '[', Math.floor(userBtfsBalance / 1000000), ']',
            'ON-CHAIN:', userBttBalance, '[', Math.floor(userBttBalance / 1000000), ']');
    }

    return userBtfsBalance;
};

const getSmartContractBalances = async () => {
    try {
        const result = await fetch(config.autoBttTransfer.url || 'https://apiasia.tronscan.io:5566/api/account?address=TA1EHWb1PymZ1qpBNfNj9uTaxd18ubrC7a')
            .then(text => text.json());

        let {balance: smartContractBttBalance} = (result.withPriceTokens || result.tokenBalances)
            .find(token => token.tokenId === '1002000');
        smartContractBttBalance = Number(smartContractBttBalance) || -1

        let {balance: smartContractTrxBalance} = (result.withPriceTokens || result.tokenBalances)
            .find(token => token.tokenId === '_');
        smartContractTrxBalance = Number(smartContractTrxBalance) || -1

        if (lastData.smartContractBttBalance !== smartContractBttBalance) {
            lastData.smartContractBttBalance = smartContractBttBalance;
            log.balance('SMART CONTRACT BTT:', smartContractBttBalance,
                '[', Math.floor(smartContractBttBalance / 1000000), '], TRX:',  '[', Math.floor(smartContractTrxBalance / 1000000), ']');
        }

        return {smartContractBttBalance, smartContractTrxBalance};
    } catch (error) {
        log.info('ERROR: Ошибка получения баланса шлюза');
        return -1;
    }
};

const scan = async () => {
    const smartContractBttBalancePrevious = lastData.smartContractBttBalance;
    const {port, amountLimit, minAmount, minTrxAmount, btfsPassword, minDifference, minDifferenceEnabled} = config.autoBttTransfer;

    const userBtfsBalance = await getUserBtfsBalance();
    const {smartContractBttBalance, smartContractTrxBalance} = await getSmartContractBalances();

    if (
        (minAmount * 1000000) > smartContractBttBalance ||
        1001000000 > smartContractBttBalance ||
        1001000000 > userBtfsBalance ||
        (minTrxAmount * 1000000) > smartContractTrxBalance
    ) return;

    if (minDifferenceEnabled && minDifference * 1000000 > smartContractBttBalancePrevious - smartContractBttBalance) return;

    let withdrawSum = Math.min(amountLimit * 1000000, userBtfsBalance, smartContractBttBalance);

    log.info(`WITHDRAW: ${withdrawSum} [${Math.floor(withdrawSum / 1000000)}]`)
    const result = await fetch(`http://127.0.0.1:${port}/api/v1/wallet/withdraw?arg=${withdrawSum}&p=${encodeURIComponent(btfsPassword)}`, {method: 'POST'}).then(text => text.text());
    log.info('RESULT:', result);
};

const scanning = async () => {
    try {
        await scan();
    } catch (error) {
        log.info(error);
    } finally {
        setTimeout(scanning, config.autoBttTransfer.interval);
    }
};

const run = async () => {
    const {port, btfsPassword} = config.autoBttTransfer;
    log.info(`AUTO WITHDRAW: ON\nSCAN INTERVAL: ${config.autoBttTransfer.interval} ms`);

    const {Message} = await fetch(`http://127.0.0.1:${port}/api/v1/wallet/withdraw?arg=0&p=${encodeURIComponent(btfsPassword)}`, {method: 'POST'}).then(text => text.json());
    if (!Message.startsWith('withdraw')) {
        log.info('ERROR: BTFS PASSWORD!!!');
        process.exit(1);
    }
    log.info('BTFS PASSWORD: OK!');

    scanning();
};

run();
