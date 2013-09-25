rewardConfig={
	"total":105000,
	"size":3000,
	"key_length":4,
	"length":5,
	"0":{"max":600,"min":500,"count":5},
	"1":{"max":400,"min":250,"count":45},
	"2":{"max":250,"min":100,"count":120},
	"3":{"max":100,"min":50,"count":500},
	"4":{"max":50,"min":1,"count":2330}
	};

goldConfig={
	"size":24,
	"max":998,
	"min":100,
    "length":10,
	"0":{"gold":1111,"gem":20},
	"1":{"gold":2222,"gem":20},
	"2":{"gold":3333,"gem":20},
	"3":{"gold":4444,"gem":20},
	"4":{"gold":5555,"gem":20},
	"5":{"gold":6666,"gem":20},
	"6":{"gold":7777,"gem":20},
	"7":{"gold":8888,"gem":20},
	"8":{"gold":9999,"gem":20},
    "9":{"gold":50000,"gem":50}
	};

deductConfig={
	"size":20,		
	"key_length":4,
	"value":500
	};

exports.goldConfig = goldConfig;
exports.rewardConfig = rewardConfig;
exports.deductConfig = deductConfig;