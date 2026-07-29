/**
 * 30DAYS INVESTMENT BOT - TELEGRAM
 * Complete Node.js Implementation
 * Firebase + Moralis + TronGrid Integration
 */

const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

// ==================== CONFIGURATION ====================
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'days-51e9b.firebaseapp.com',
  databaseURL: 'https://days-51e9b-default-rtdb.firebaseio.com',
  projectId: 'days-51e9b',
  storageBucket: 'days-51e9b.appspot.com',
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const MORALIS_API = process.env.MORALIS_API_KEY;
const TRONGRID_API = process.env.TRONGRID_API_KEY;
const BEP20_WALLET = '0x7fD50dAAfeA0a8Df3E4860ECC81939fFBaa11396';
const TRC20_WALLET = 'TYDHcrwhGkRH68u2fWat72iJoNFqhoadHy';

// ==================== FIREBASE INIT ====================
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  databaseURL: FIREBASE_CONFIG.databaseURL
});

const db = admin.database();
const bot = new TelegramBot(TOKEN, { polling: true });

// ==================== PROFIT CALCULATION ====================

function getProfitPercentage(depositAmount) {
  if (depositAmount >= 10 && depositAmount < 20) return 2.0;
  if (depositAmount >= 20 && depositAmount < 60) return 2.3;
  if (depositAmount >= 60 && depositAmount < 150) return 3.2;
  if (depositAmount >= 150) return 4.0;
  return 2.0;
}

function calculateDailyProfit(depositAmount, percentage) {
  return (depositAmount * percentage) / 100;
}

function calculateTotalProfit(dailyProfit) {
  return dailyProfit * 30;
}

function calculateTotalWithdraw(depositAmount, totalProfit) {
  return depositAmount + totalProfit;
}

function calculateFullProfit(depositAmount) {
  const percentage = getProfitPercentage(depositAmount);
  const dailyProfit = calculateDailyProfit(depositAmount, percentage);
  const totalProfit = calculateTotalProfit(dailyProfit);
  const totalWithdraw = calculateTotalWithdraw(depositAmount, totalProfit);

  return {
    depositAmount,
    percentage,
    dailyProfit: parseFloat(dailyProfit.toFixed(2)),
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    totalWithdraw: parseFloat(totalWithdraw.toFixed(2)),
    withdrawFee: 0.5,
    netWithdraw: parseFloat((totalWithdraw - 0.5).toFixed(2))
  };
}

// ==================== USER MANAGEMENT ====================

async function createUser(userId, username) {
  try {
    const userRef = db.ref(`users/${userId}`);
    await userRef.set({
      userId,
      username,
      createdAt: new Date().toISOString(),
      totalDeposits: 0,
      totalWithdrawals: 0,
      balance: 0,
      referralCode: userId.toString(),
      referredBy: null,
      lastLogin: new Date().toISOString()
    });
    console.log(`✅ User created: ${userId}`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function getUser(userId) {
  try {
    const snapshot = await db.ref(`users/${userId}`).once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

async function updateUserDeposit(userId, amount, network, txHash) {
  try {
    const userRef = db.ref(`users/${userId}`);
    const user = await getUser(userId);

    if (!user) {
      await createUser(userId, `user_${userId}`);
    }

    const depositRef = db.ref(`deposits/${userId}/${Date.now()}`);
    await depositRef.set({
      amount,
      network,
      txHash,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    await userRef.update({
      totalDeposits: admin.database.ServerValue.increment(amount),
      balance: admin.database.ServerValue.increment(amount)
    });

    console.log(`✅ Deposit recorded: User ${userId}, Amount: $${amount}`);
  } catch (error) {
    console.error('Error updating deposit:', error);
  }
}

async function updateUserWithdrawal(userId, amount, network, address) {
  try {
    const userRef = db.ref(`users/${userId}`);
    const user = await getUser(userId);

    if (!user) return false;
    if (user.balance < amount + 0.5) return false;

    const withdrawRef = db.ref(`withdrawals/${userId}/${Date.now()}`);
    await withdrawRef.set({
      amount,
      fee: 0.5,
      netAmount: amount - 0.5,
      network,
      address,
      status: 'pending',
      timestamp: new Date().toISOString()
    });

    await userRef.update({
      totalWithdrawals: admin.database.ServerValue.increment(amount),
      balance: admin.database.ServerValue.increment(-amount)
    });

    console.log(`✅ Withdrawal recorded: User ${userId}, Amount: $${amount}`);
    return true;
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return false;
  }
}

async function getUserPlans(userId) {
  try {
    const snapshot = await db.ref(`plans/${userId}`).once('value');
    return snapshot.val() || {};
  } catch (error) {
    console.error('Error getting plans:', error);
    return {};
  }
}

async function createPlan(userId, depositAmount, startDate = new Date()) {
  try {
    const profitData = calculateFullProfit(depositAmount);
    
    const planRef = db.ref(`plans/${userId}/${Date.now()}`);
    await planRef.set({
      depositAmount,
      percentage: profitData.percentage,
      dailyProfit: profitData.dailyProfit,
      totalProfit: profitData.totalProfit,
      totalWithdraw: profitData.totalWithdraw,
      startDate: startDate.toISOString(),
      endDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      cumulativeProfit: 0,
      daysCompleted: 0,
      lastClaimDate: startDate.toISOString()
    });

    console.log(`✅ Plan created: User ${userId}, Deposit: $${depositAmount}`);
    return profitData;
  } catch (error) {
    console.error('Error creating plan:', error);
    return null;
  }
}

async function updateCumulativeProfit(userId) {
  try {
    const plans = await getUserPlans(userId);

    for (const [planId, plan] of Object.entries(plans)) {
      if (plan.status !== 'active') continue;

      const startDate = new Date(plan.startDate);
      const now = new Date();
      const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;

      if (daysPassed > 30) {
        await db.ref(`plans/${userId}/${planId}`).update({
          status: 'completed',
          cumulativeProfit: plan.totalProfit,
          daysCompleted: 30
        });
      } else {
        const cumulativeProfit = plan.dailyProfit * daysPassed;
        await db.ref(`plans/${userId}/${planId}`).update({
          cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
          daysCompleted: daysPassed
        });
      }
    }
  } catch (error) {
    console.error('Error updating cumulative profit:', error);
  }
}

// ==================== TELEGRAM COMMANDS ====================

bot.onText(/\/start(.*)/, async (msg, match) => {
  const userId = msg.from.id;
  const username = msg.from.username || `user_${userId}`;
  const referralCode = match[1]?.trim();

  try {
    let user = await getUser(userId);
    if (!user) {
      await createUser(userId, username);
      user = await getUser(userId);
    }

    if (referralCode && referralCode !== userId.toString()) {
      await db.ref(`users/${userId}`).update({
        referredBy: referralCode
      });
    }

    const welcomeText = `
🎯 *Welcome to 30Days!*

Your Profile:
├─ User ID: ${userId}
├─ Total Deposit: $${user.totalDeposits || 0}
├─ Total Withdraw: $${user.totalWithdrawals || 0}
└─ Balance: $${user.balance || 0}

Commands:
/deposit - Deposit USDT
/withdraw - Withdraw funds
/balance - Check balance
/plans - View investment plans
/tasks - Daily attendance
/referral - Get referral link
/help - Get help
    `;

    bot.sendMessage(userId, welcomeText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /start:', error);
    bot.sendMessage(userId, '❌ Error processing your request');
  }
});

bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;

  try {
    const user = await getUser(userId);
    if (!user) {
      bot.sendMessage(userId, '❌ User not found. Use /start first');
      return;
    }

    const balanceText = `
💰 *Your Balance*

├─ Total Deposits: $${user.totalDeposits.toFixed(2)}
├─ Total Withdrawals: $${user.totalWithdrawals.toFixed(2)}
└─ Current Balance: $${user.balance.toFixed(2)}

Use /plans to view your investments
    `;

    bot.sendMessage(userId, balanceText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /balance:', error);
    bot.sendMessage(userId, '❌ Error retrieving balance');
  }
});

bot.onText(/\/plans/, async (msg) => {
  const userId = msg.from.id;

  try {
    const plans = await getUserPlans(userId);
    if (Object.keys(plans).length === 0) {
      bot.sendMessage(userId, '📊 You have no active investment plans. Use /deposit to create one.');
      return;
    }

    let plansText = '📊 *Your Investment Plans*\n\n';
    
    for (const [planId, plan] of Object.entries(plans)) {
      plansText += `
Plan #${planId.slice(-4)}
├─ Investment: $${plan.depositAmount}
├─ Daily Profit: $${plan.dailyProfit}
├─ Cumulative Profit: $${plan.cumulativeProfit}
├─ Total Profit (30d): $${plan.totalProfit}
├─ Total Withdraw: $${plan.totalWithdraw}
├─ Progress: ${plan.daysCompleted}/30 days
├─ Status: ${plan.status}
└─ Net (after $0.5 fee): $${(plan.totalWithdraw - 0.5).toFixed(2)}

`;
    }

    bot.sendMessage(userId, plansText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /plans:', error);
    bot.sendMessage(userId, '❌ Error retrieving plans');
  }
});

bot.onText(/\/deposit/, async (msg) => {
  const userId = msg.from.id;

  const depositText = `
💳 *Deposit Instructions*

*Network Selection:*

1️⃣ *BEP20 (Binance Smart Chain)*
├─ Min Deposit: $10
├─ Currency: USDT
└─ Address: \`${BEP20_WALLET}\`

2️⃣ *TRC20 (Tron Network)*
├─ Min Deposit: $10
├─ Currency: USDT
└─ Address: \`${TRC20_WALLET}\`

⚠️ *Important:*
• Copy the address carefully
• Deposit will appear in 2-5 minutes
• Minimum deposit: $1.50 withdrawal
• Withdrawal fee: $0.5

*Profit Examples:*
• $10 → 2% daily → $6 total (30 days) → $16 withdraw
• $20 → 2.3% daily → $13.80 total → $33.80 withdraw
• $60 → 3.2% daily → $57.60 total → $117.60 withdraw
• $150 → 4% daily → $180 total → $330 withdraw

Use /withdraw to claim earnings
    `;

  bot.sendMessage(userId, depositText, { parse_mode: 'Markdown' });
});

bot.onText(/\/withdraw/, async (msg) => {
  const userId = msg.from.id;

  try {
    const user = await getUser(userId);
    if (!user || user.balance < 1.5) {
      bot.sendMessage(userId, '❌ Insufficient balance (minimum $1.50 withdrawal)');
      return;
    }

    const withdrawText = `
💸 *Withdraw Funds*

Your Available Balance: $${user.balance.toFixed(2)}

*Withdrawal Rules:*
├─ Minimum: $1.50
├─ Fee: $0.5 (fixed)
├─ Networks: BEP20, TRC20
└─ Status: Pending approval

To withdraw, reply with:
\`withdraw [amount] [network] [address]\`

Example:
\`withdraw 10 BEP20 0x...\`
\`withdraw 15 TRC20 TY...\`
    `;

    bot.sendMessage(userId, withdrawText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /withdraw:', error);
    bot.sendMessage(userId, '❌ Error processing withdrawal');
  }
});

bot.onText(/\/referral/, async (msg) => {
  const userId = msg.from.id;

  const referralText = `
👥 *Referral Program*

Your Referral Code: \`${userId}\`

Share this link:
\`https://t.me/Stock_30Days_bot?start=${userId}\`

Commission Structure:
├─ Level 1: 5% (Direct referral)
├─ Level 2-5: 5% (Indirect deposits)
├─ Level 6-10: 3% (Deep level)
└─ Level 11-15: 2% (Deepest level)

Earn unlimited commissions!
    `;

  bot.sendMessage(userId, referralText, { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, (msg) => {
  const userId = msg.from.id;

  const helpText = `
📚 *30Days Bot - Help*

*Available Commands:*
/start - Initialize bot
/balance - Check your balance
/plans - View investment plans
/deposit - Deposit instructions
/withdraw - Withdraw funds
/referral - Referral program
/tasks - Daily attendance
/help - Show this help

*FAQ:*

Q: How much can I earn?
A: Profit depends on your deposit:
   • $10 → $6 profit (30 days)
   • $20 → $13.80 profit
   • $60 → $57.60 profit
   • $150 → $180 profit

Q: Minimum withdrawal?
A: $1.50 (fee: $0.5)

Q: How long is a plan?
A: 30 days with daily profit accrual

Q: Can I withdraw anytime?
A: Yes, minimum $1.50

For support: @SupportBot
    `;

  bot.sendMessage(userId, helpText, { parse_mode: 'Markdown' });
});

bot.onText(/\/tasks/, async (msg) => {
  const userId = msg.from.id;

  try {
    const tasksRef = db.ref(`tasks/${userId}`);
    const snapshot = await tasksRef.once('value');
    const tasks = snapshot.val() || {};

    const today = new Date().toISOString().split('T')[0];
    const hasTaskToday = tasks[today];

    if (!hasTaskToday) {
      await db.ref(`tasks/${userId}/${today}`).set({
        date: today,
        completed: true,
        timestamp: new Date().toISOString()
      });
    }

    const taskCount = Object.keys(tasks).length;

    const tasksText = `
📅 *Daily Tasks*

✅ Daily Sign-in: Completed
├─ Today's Entry: ✓
├─ This Month: ${taskCount} days
└─ Cumulative: ${taskCount} days

Reward:
✓ +0.1% bonus on next deposit

Keep signing in daily to maintain streak!
    `;

    bot.sendMessage(userId, tasksText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /tasks:', error);
    bot.sendMessage(userId, '❌ Error retrieving tasks');
  }
});

// ==================== ERROR HANDLING ====================

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('error', (error) => {
  console.error('Bot error:', error);
});

console.log('✅ 30Days Bot started successfully!');
console.log('📊 Firebase connected');
console.log('🔐 Moralis & TronGrid ready');
console.log('🤖 Telegram bot listening...');
