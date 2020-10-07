// Copyright (c) 2018-2019 The Decred developers
// Use of this source code is governed by an ISC
// license that can be found in the LICENSE file.

package postgres

//go:generate sqlboiler --wipe psql --no-hooks --no-auto-timestamps

import (
	"context"
	"database/sql"
	"log"
	"os"
	"strings"
	"time"
	"tronmatrix/postgres/models"

	"github.com/volatiletech/sqlboiler/boil"
)

type PgDb struct {
	db           *sql.DB
	queryTimeout time.Duration
}

var Instance *PgDb

type ProfitEvent struct {
	TransactionID string `json:"transaction_id"`
	Result        struct {
		Referral string `json:"referral"`
		Level    int64  `json:"level,string"`
		Time     int64  `json:"time,string"`
		User     string `json:"user"`
	} `json:"result"`
}

type logWriter struct{}

func (l logWriter) Write(p []byte) (n int, err error) {
	log.Println(string(p))
	return len(p), nil
}

func NewPgDb(debug bool) (*PgDb, error) {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	db.SetMaxOpenConns(5)
	if debug {
		boil.DebugMode = true
		boil.DebugWriter = logWriter{}
	}
	Instance = &PgDb{
		db:           db,
		queryTimeout: time.Second * 30,
	}

	return Instance, nil
}

func (pg *PgDb) Close() error {
	log.Println("Closing postgresql connection")
	return pg.db.Close()
}

var incentives = map[int64]int64{
	1: 18,
	2: 75,
	3: 128,
	4: 325,
	5: 1000,
	6: 2750,
}

func (pg PgDb) InsertProfit(ctx context.Context, rec ProfitEvent) (bool, error) {
	profit := models.Profit{
		ReferralAddress: rec.Result.Referral,
		UserAddress:     rec.Result.User,
		Level:           rec.Result.Level,
		Time:            rec.Result.Time,
		Amount:          rec.Result.Level * incentives[rec.Result.Level],
	}
	if err := profit.Insert(ctx, pg.db, boil.Infer()); err != nil {
		if strings.Contains(err.Error(), "unique constraint") { // Ignore duplicate entries
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (pg PgDb) GetLevelEarnings(user string, level int64) (int64, error) {
	var total int64
	rows := pg.db.QueryRow("SELECT SUM(amount) as total FROM profit WHERE referral_address = 1$ AND level = 2$ LIMIT 1")
	err := rows.Scan(&total)
	if err == sql.ErrNoRows {
		return 0, nil
	}
	return total, err
}

func (pg PgDb) LastProfitEventTime() (int64, error) {
	var time int64
	rows := pg.db.QueryRow("SELECT MAX(time) FROM profit LIMIT 1")
	err := rows.Scan(&time)
	if err == sql.ErrNoRows {
		return 0, nil
	}
	return time, err
}
