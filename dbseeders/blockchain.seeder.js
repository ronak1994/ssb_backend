import mongoose from 'mongoose';
import { Blockchain, GlobalSupply, Phase } from '../src/models/blockchain.model.js';
import Discount from '../src/models/discount.model.js';

const blockchainData = [
  {
    name: "Green SS",
    nftTypes: [
      { name: "Fresh", blocks: 450 },
      { name: "mini", blocks: 150 },
      { name: "micro", blocks: 75 }
    ],
    phaseWiseBonuses: [
      { phaseName: "A", phaseBonus: 40000, investorBonus: { days: 30, dailyBonusToken: 500 }, watchBonus: { days: 730, dailyBonusToken: 100 }, totalWithdrawalLimit: 1000 },
      { phaseName: "B", phaseBonus: 30000, investorBonus: { days: 30, dailyBonusToken: 500 }, watchBonus: { days: 730, dailyBonusToken: 100 }, totalWithdrawalLimit: 2000 },
      { phaseName: "C", phaseBonus: 20000, investorBonus: { days: 30, dailyBonusToken: 500 }, watchBonus: { days: 730, dailyBonusToken: 100 }, totalWithdrawalLimit: 3000 },
      { phaseName: "D", phaseBonus: 15000, investorBonus: { days: 30, dailyBonusToken: 500 }, watchBonus: { days: 730, dailyBonusToken: 100 }, totalWithdrawalLimit: 4000 },
      { phaseName: "E", phaseBonus: 10000, investorBonus: { days: 30, dailyBonusToken: 500 }, watchBonus: { days: 730, dailyBonusToken: 100 }, totalWithdrawalLimit: 5000 }
    ],
    dailyMineCap: 2299,
    contractAddress: "0x123456789abcdef",
    nftAddress:"0x400fBDE10146750d64bbA3DD5f1bE177F2822BB3",
    tokenUri:"https://teal-obvious-tahr-119.mypinata.cloud/ipfs/bafkreibjyr4bcacbnkrvqxgrvjl3yutyiaife3wv4udvfbxowamzwgng7u",
    icon: "../../assets/icons/Green_Icon.png",
    gradient: "../../assets/images/CardTopGreen.png",
  
    styles: {
      gradient: {
        width: "width * 0.73",
        height: "height * 0.18",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
      },
      title: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
        fontFamily: "Lexend",
      },
      price: {
        color: "#fff",
        fontSize: 24,
        marginTop: 4,
        textAlign: "center",
        fontFamily: "Lexend-Bold",
      },
    },
    mainNftPrice: 10000,
    referPercentage: 15
  },
  {
    name: "Gold SS",
    nftTypes: [
      { name: "Fresh", blocks: 450 },
      { name: "mini", blocks: 150 },
      { name: "micro", blocks: 75 }
    ],
    phaseWiseBonuses: [
      { phaseName: "A", phaseBonus: 20000, investorBonus: { days: 30, dailyBonusToken: 167 }, watchBonus: { days: 450, dailyBonusToken: 50 }, totalWithdrawalLimit: 500 },
      { phaseName: "B", phaseBonus: 15000, investorBonus: { days: 30, dailyBonusToken: 167 }, watchBonus: { days: 450, dailyBonusToken: 50 }, totalWithdrawalLimit: 1000 },
      { phaseName: "C", phaseBonus: 10000, investorBonus: { days: 30, dailyBonusToken: 167 }, watchBonus: { days: 450, dailyBonusToken: 50 }, totalWithdrawalLimit: 1500 },
      { phaseName: "D", phaseBonus: 7500, investorBonus: { days: 30, dailyBonusToken: 167 }, watchBonus: { days: 450, dailyBonusToken: 50 }, totalWithdrawalLimit: 2000 },
      { phaseName: "E", phaseBonus: 10000, investorBonus: { days: 30, dailyBonusToken: 167 }, watchBonus: { days: 450, dailyBonusToken: 50 }, totalWithdrawalLimit: 2500 }
    ],
    nftAddress:"0x7E3e103853E23F78cfCC43B3309cE2E6659C072A",
    dailyMineCap: 1919,
    contractAddress: "0x123456789abcdef",
    icon: "../../assets/icons/Gold_Icon.png",
    gradient: "../../assets/images/CardTopGold.png",
    tokenUri:"https://teal-obvious-tahr-119.mypinata.cloud/ipfs/bafkreia5si2ltnjep6tuajiumy4xhb2uokxaffzpc4j6nw2sjgzizwwvoa",
     
    mainNftPrice: 5000,
    referPercentage: 10
  },
  {
    name: "Silver SS",
    nftTypes: [
      { name: "Fresh", blocks: 450 },
      { name: "mini", blocks: 150 },
      { name: "micro", blocks: 75 }
    ],
    phaseWiseBonuses: [
      { phaseName: "A", phaseBonus: 4000, investorBonus: { days: 30, dailyBonusToken: 16 }, watchBonus: { days: 300, dailyBonusToken: 10 }, totalWithdrawalLimit: 100 },
      { phaseName: "B", phaseBonus: 3000, investorBonus: { days: 30, dailyBonusToken: 16 }, watchBonus: { days: 300, dailyBonusToken: 10 }, totalWithdrawalLimit: 200 },
      { phaseName: "C", phaseBonus: 2000, investorBonus: { days: 30, dailyBonusToken: 16 }, watchBonus: { days: 300, dailyBonusToken: 10 }, totalWithdrawalLimit: 300 },
      { phaseName: "D", phaseBonus: 1500, investorBonus: { days: 30, dailyBonusToken: 16 }, watchBonus: { days: 300, dailyBonusToken: 10 }, totalWithdrawalLimit: 400 },
      { phaseName: "E", phaseBonus: 1000, investorBonus: { days: 30, dailyBonusToken: 16 }, watchBonus: { days: 300, dailyBonusToken: 10 }, totalWithdrawalLimit: 500 }
    ],
    dailyMineCap: 1534,
    nftAddress:"0x3DaD996bC84ABcB22dbbB2a9e2a2Bf994eA8B93c",
    contractAddress: "0x123456789abcdef",
    icon: "../../assets/icons/Silver_Icon_Big.png",
    gradient: "../../assets/images/CardTopSilver.png",
    tokenUri:"https://teal-obvious-tahr-119.mypinata.cloud/ipfs/bafkreidy44jpxtbpp6bkarqg3fujfd5hvfbi3cn6t22uqc5cmk2bowabxu",
     
    styles: {
      gradient: {
        width: "width * 0.73",
        height: "height * 0.18",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
      },
      title: {
        color: "#200745",
        fontSize: 20,
        textAlign: "center",
        fontFamily: "Lexend-Bold",
      },
      price: {
        color: "#200745",
        fontSize: 26,
        marginTop: 4,
        textAlign: "center",
        fontFamily: "Lexend-Bold",
      },
    },
    mainNftPrice: 1000,
    referPercentage: 8
  },
  {
    name: "Black SS",
    nftTypes: [
      { name: "Fresh", blocks: 450 },
      { name: "mini", blocks: 150 },
      { name: "micro", blocks: 75 }
    ],
    phaseWiseBonuses: [
      { phaseName: "A", phaseBonus: 2000, investorBonus: { days: 30, dailyBonusToken: 5 }, totalWithdrawalLimit: 50 },
      { phaseName: "B", phaseBonus: 1500, investorBonus: { days: 30, dailyBonusToken: 5 }, totalWithdrawalLimit: 100 },
      { phaseName: "C", phaseBonus: 1000, investorBonus: { days: 30, dailyBonusToken: 5 }, totalWithdrawalLimit: 150 },
      { phaseName: "D", phaseBonus: 750, investorBonus: { days: 30, dailyBonusToken: 5 }, totalWithdrawalLimit: 300 },
      { phaseName: "E", phaseBonus: 500, investorBonus: { days: 30, dailyBonusToken: 5 }, totalWithdrawalLimit: 250 }
    ],
    nftAddress:"0x7f70F3737f856a07bD428dfc1038957F976F1562",
    dailyMineCap: 1150,
    contractAddress: "0x123456789abcdef",
    icon: "../../assets/icons/Black_Icon.png",
    gradient: "../../assets/images/CardTopBlack.png",
    tokenUri:"https://teal-obvious-tahr-119.mypinata.cloud/ipfs/bafkreigct22g3bgtrfgbyzzaqhjxqvmzzy7x3vqtzyx5w6bpnuawymcbmi",
    styles: {
      gradient: {
        width: "width * 0.73",
        height: "height * 0.18",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
      },
      title: {
        color: "#FFFFFF",
        fontSize: 18,
        textAlign: "center",
        fontFamily: "Lexend",
      },
      price: {
        color: "#FFFFFF",
        fontSize: 24,
        marginTop: 4,
        textAlign: "center",
        fontFamily: "Lexend-Bold",
      },
    },
    mainNftPrice: 500,
    referPercentage: 7
  },
  {
    name: "White SS",
    nftTypes: [
      { name: "Fresh", blocks: 450 },
      { name: "mini", blocks: 150 },
      { name: "micro", blocks: 75 }
    ],
    phaseWiseBonuses: [
      { phaseName: "A", phaseBonus: 400, investorBonus: { days: 30, dailyBonusToken: 1 }, totalWithdrawalLimit: 10 },
      { phaseName: "B", phaseBonus: 300, investorBonus: { days: 30, dailyBonusToken: 1 }, totalWithdrawalLimit: 20 },
      { phaseName: "C", phaseBonus: 200, investorBonus: { days: 30, dailyBonusToken: 1 }, totalWithdrawalLimit: 30 },
      { phaseName: "D", phaseBonus: 150, investorBonus: { days: 30, dailyBonusToken: 1 }, totalWithdrawalLimit: 40 },
      { phaseName: "E", phaseBonus: 100, investorBonus: { days: 30, dailyBonusToken: 1 }, totalWithdrawalLimit: 50 }
    ],
    nftAddress:"0xAa84dd899F0831A956210b7016cC3817Ab537B1a",
    dailyMineCap: 767,
    contractAddress: "0x123456789abcdef",
    tokenUri: "https://teal-obvious-tahr-119.mypinata.cloud/ipfs/bafkreibjyr4bcacbnkrvqxgrvjl3yutyiaife3wv4udvfbxowamzwgng7u",
    icon: "https://yourserver.com/assets/icons/White_Icon.png",
    gradient: "https://yourserver.com/assets/images/CardTop.png",
    mainNftPrice: 100,
    referPercentage: 7,
    styles: {
      gradient: {
        width: "width * 0.73",
        height: "height * 0.18",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
      },
      title: {
        color: "#200745",
        fontSize: 18,
        textAlign: "center",
        fontFamily: "Lexend",
      },
      price: {
        color: "#200745",
        fontSize: 24,
        marginTop: 4,
        textAlign: "center",
        fontFamily: "Lexend-Bold",
      },
    },
  }
];

const globalData = [
  {
    totalSupply: 840000000,
    totalValidatorSupply: 336000000,
    totalStakingSupply: 226800000,
    totalTeamSupply: 277200000,
    dailyValidatorSupply: 7669,
    dailyStakingSupply: 5173,
    totalInvestorSupply: null,
    totalFounderSupply: null,
    totalCMESupply: null,
    totalPartnershipSupply: null
  }
];

const phaseData = [
  { name: "A", totalSupply: 18000000, ssbtPrice: 0.05, isActive: true },
  { name: "B", totalSupply: 18000000, ssbtPrice: 0.06, isActive: false },
  { name: "C", totalSupply: 18000000, ssbtPrice: 0.07, isActive: false },
  { name: "D", totalSupply: 18000000, ssbtPrice: 0.08, isActive: false },
  { name: "E", totalSupply: 17468000, ssbtPrice: 0.09, isActive: false }
];

const discountData = [
  {
    code: "WELCOME50",
    amount: 50,
    type: "percentage",
    expiryDate: new Date("2025-12-31"),
    usageLimit: 100,
    usedCount: 0,
    isActive: true
  },
  {
    code: "FLAT100",
    amount: 100,
    type: "fixed",
    expiryDate: new Date("2025-06-30"),
    usageLimit: 50,
    usedCount: 0,
    isActive: true
  },
  {
    code: "SUMMER20",
    amount: 20,
    type: "percentage",
    expiryDate: new Date("2024-08-31"),
    usageLimit: 200,
    usedCount: 5,
    isActive: true
  },
  {
    code: "BLACKFRIDAY",
    amount: 30,
    type: "percentage",
    expiryDate: new Date("2024-11-29"),
    usageLimit: 500,
    usedCount: 10,
    isActive: true
  },
  {
    code: "HOLIDAY150",
    amount: 150,
    type: "fixed",
    expiryDate: new Date("2024-12-31"),
    usageLimit: 300,
    usedCount: 20,
    isActive: true
  },
  {
    code: "NEWYEAR25",
    amount: 25,
    type: "percentage",
    expiryDate: new Date("2025-01-10"),
    usageLimit: 150,
    usedCount: 30,
    isActive: true
  },
  {
    code: "LOYAL500",
    amount: 500,
    type: "fixed",
    expiryDate: new Date("2026-12-31"),
    usageLimit: 1000,
    usedCount: 100,
    isActive: true
  }
];

const seedDatabase = async () => {
  await mongoose.connect('mongodb://localhost:27017/ssb-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await Blockchain.deleteMany({});
  await GlobalSupply.deleteMany({});
  await Phase.deleteMany({});
  await Discount.deleteMany(); // Clear existing data

  await Blockchain.insertMany(blockchainData);
  await GlobalSupply.insertMany(globalData);
  await Phase.insertMany(phaseData);
  await Discount.insertMany(discountData);

  console.log('✅ Blockchain, Global Supply, and Phase data seeded successfully!');
  mongoose.connection.close();
};

seedDatabase().catch(err => console.error('Error seeding database:', err));
