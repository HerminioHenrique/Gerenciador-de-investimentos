import { 
  differenceInMonths, 
  differenceInWeeks,
  differenceInDays, 
  addMonths, 
  addWeeks,
  addDays,
  setDate, 
  setDay,
  isAfter, 
  startOfDay,
  nextDay
} from 'date-fns';
import { UserProfile, Deposit, Payment, ClientStats, PaymentFrequency } from '../types';

export function calculateCompoundInterest(
  amount: number,
  rate: number,
  startDate: Date,
  frequency: PaymentFrequency = 'monthly',
  currentDate: Date = new Date()
): number {
  let periods = 0;
  if (frequency === 'weekly') {
    periods = Math.max(0, differenceInWeeks(currentDate, startDate));
  } else if (frequency === 'biweekly') {
    periods = Math.max(0, Math.floor(differenceInDays(currentDate, startDate) / 14));
  } else {
    periods = Math.max(0, differenceInMonths(currentDate, startDate));
  }
  return amount * Math.pow(1 + rate / 100, periods);
}

export function getClientStats(
  client: UserProfile,
  deposits: Deposit[],
  payments: Payment[],
  overrideRate?: number
): ClientStats {
  const now = new Date();
  const rate = typeof client.interestRate === 'number' ? client.interestRate : parseFloat(client.interestRate as any || '0');
  const profitRate = typeof overrideRate === 'number' ? overrideRate : rate;
  const payDay = client.paymentDay || 1;
  const frequency = client.paymentFrequency || 'monthly';

  let totalInvested = 0;
  let currentBalance = 0;

  // Calculate balance from deposits
  deposits.forEach((d) => {
    const depositDate = new Date(d.date);
    totalInvested += d.amount;
    // For current balance, we use compound interest based on full periods passed
    currentBalance += calculateCompoundInterest(d.amount, rate, depositDate, frequency, now);
  });

  // Subtract payments (only withdrawals, reinvestments don't reduce balance)
  const totalPaid = payments
    .filter(p => p.type !== 'reinvestment')
    .reduce((sum, p) => sum + p.amount, 0);
  currentBalance -= totalPaid;

  // Period profit projection (Next period's yield)
  const periodProfit = currentBalance * (profitRate / 100);

  // Next payment date calculation
  let nextPayment = new Date();

  if (frequency === 'monthly') {
    nextPayment = setDate(now, payDay);
    if (isAfter(startOfDay(now), startOfDay(nextPayment))) {
      nextPayment = addMonths(nextPayment, 1);
    }
  } else if (frequency === 'weekly') {
    // payDay 1-7 (Mon-Sun)
    const targetDay = (payDay % 7); // date-fns uses 0-6 (Sun-Sat)
    nextPayment = setDay(now, targetDay);
    if (isAfter(startOfDay(now), startOfDay(nextPayment))) {
      nextPayment = addWeeks(nextPayment, 1);
    }
  } else if (frequency === 'biweekly') {
    // Every 14 days from createdAt
    const anchor = new Date(client.createdAt);
    const daysSinceAnchor = differenceInDays(now, anchor);
    const periodsPassed = Math.floor(daysSinceAnchor / 14);
    nextPayment = addDays(anchor, (periodsPassed + 1) * 14);
  }
  
  const daysRemaining = Math.max(0, differenceInDays(nextPayment, now));

  // Payment status logic
  const firstDepositDate = deposits.length > 0 
    ? new Date(Math.min(...deposits.map(d => new Date(d.date).getTime())))
    : null;

  const lastPayment = payments.length > 0 
    ? new Date(Math.max(...payments.map(p => new Date(p.date).getTime())))
    : null;

  let previousPaymentDate: Date;
  let warningThreshold: number;

  if (frequency === 'monthly') {
    previousPaymentDate = addMonths(nextPayment, -1);
    warningThreshold = 3;
  } else if (frequency === 'weekly') {
    previousPaymentDate = addWeeks(nextPayment, -1);
    warningThreshold = 1;
  } else {
    previousPaymentDate = addDays(nextPayment, -14);
    warningThreshold = 2;
  }

  // A payment is considered "paid" if it happened on or after the previous payment date
  // (i.e., it covers the period that just ended or is about to end)
  const isPaid = lastPayment ? !isAfter(startOfDay(previousPaymentDate), startOfDay(lastPayment)) : false;
  
  // Overdue if:
  // 1. Not paid
  // 2. Today is on or after the due date (previousPaymentDate)
  // 3. The due date is AFTER the first deposit (you don't owe for periods before you invested)
  const isOverdue = !isPaid && 
                    firstDepositDate && 
                    isAfter(startOfDay(previousPaymentDate), startOfDay(firstDepositDate)) &&
                    (isAfter(startOfDay(now), startOfDay(previousPaymentDate)) || startOfDay(now).getTime() === startOfDay(previousPaymentDate).getTime());
  
  // Warning if not paid, not overdue, and close to next payment
  // Also only if we have a deposit
  const isWarning = !isPaid && !isOverdue && firstDepositDate && daysRemaining <= warningThreshold;

  return {
    totalInvested,
    currentBalance,
    periodProfit,
    projectedTotal: currentBalance + periodProfit,
    nextPaymentDate: nextPayment,
    daysRemaining,
    isOverdue,
    isWarning,
    isPaid,
  };
}
