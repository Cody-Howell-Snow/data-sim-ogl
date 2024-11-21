type Account = {
  id: number, 
  userName: string,
  subscriptionId?: number, 
  susbscriptionDate?: Date, 
  actualCost?: number,
  yearlyPayment?: boolean, 
  featuresPurchased: Array<{pack: FeaturePack, firstPurchase: FeaturePayment}>,
  endDate?: Date, 
  expectedGames: number
}

type FeaturePayment = {
  accountId: number,
  featureId: number, 
  paymentAmount: number, 
  paymentDate: Date, 
  autoRenew: boolean, 
  yearly: boolean, 
  endDate: Date
}

type FeaturePack = {
  id: number, 
  featureName: string, 
  costAutoMonth: number, 
  costAutoYear: number, 
  costNonAutoMonth: number, 
  costNonAutoYear: number, 
}

type Subscription = {
  id: number, 
  subscriptionName: string, 
  costMonth: number, 
  costYear: number, 
  concurrentLogins: number
}

type Developer = {
  id: number, 
  developerName: string, 
  contactEmail: string, 
  revenueSharePercentage: number
}

type Game = {
  id: number,
  gameName: string, 
  developerId: number, 
  featureIds: Array<number>
}

type GamePlay = {
  game_id: number, 
  account_id: number, 
  start_play_time: Date, 
  end_play_time: Date
}

type SubPayment = {
  accountId: number, 
  subscriptionId: number, 
  paymentAmount: number, 
  paymentDate: Date, 
}

type LoginHistory = {
  accountId: number, 
  loginTime: Date, 
  loginSuccess: boolean
}