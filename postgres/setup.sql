
CREATE TABLE If NOT EXISTS profit (
	referral_address VARCHAR(256) NOT NULL,
	level INT8 NOT NULL,
	user_address VARCHAR(256) NOT NULL,
	time INT8 NOT NULL,
    amount INT8 NOT NULL,
	PRIMARY KEY (referral_address, level, user_address)
);