// Code generated by SQLBoiler 3.7.1 (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"bytes"
	"context"
	"reflect"
	"testing"

	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries"
	"github.com/volatiletech/sqlboiler/randomize"
	"github.com/volatiletech/sqlboiler/strmangle"
)

var (
	// Relationships sometimes use the reflection helper queries.Equal/queries.Assign
	// so force a package dependency in case they don't.
	_ = queries.Equal
)

func testProfits(t *testing.T) {
	t.Parallel()

	query := Profits()

	if query.Query == nil {
		t.Error("expected a query, got nothing")
	}
}

func testProfitsDelete(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := o.Delete(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testProfitsQueryDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := Profits().DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testProfitsSliceDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := ProfitSlice{o}

	if rowsAff, err := slice.DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testProfitsExists(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	e, err := ProfitExists(ctx, tx, o.ReferralAddress, o.Level, o.UserAddress)
	if err != nil {
		t.Errorf("Unable to check if Profit exists: %s", err)
	}
	if !e {
		t.Errorf("Expected ProfitExists to return true, but got false.")
	}
}

func testProfitsFind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	profitFound, err := FindProfit(ctx, tx, o.ReferralAddress, o.Level, o.UserAddress)
	if err != nil {
		t.Error(err)
	}

	if profitFound == nil {
		t.Error("want a record, got nil")
	}
}

func testProfitsBind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = Profits().Bind(ctx, tx, o); err != nil {
		t.Error(err)
	}
}

func testProfitsOne(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if x, err := Profits().One(ctx, tx); err != nil {
		t.Error(err)
	} else if x == nil {
		t.Error("expected to get a non nil record")
	}
}

func testProfitsAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	profitOne := &Profit{}
	profitTwo := &Profit{}
	if err = randomize.Struct(seed, profitOne, profitDBTypes, false, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}
	if err = randomize.Struct(seed, profitTwo, profitDBTypes, false, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = profitOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = profitTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := Profits().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 2 {
		t.Error("want 2 records, got:", len(slice))
	}
}

func testProfitsCount(t *testing.T) {
	t.Parallel()

	var err error
	seed := randomize.NewSeed()
	profitOne := &Profit{}
	profitTwo := &Profit{}
	if err = randomize.Struct(seed, profitOne, profitDBTypes, false, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}
	if err = randomize.Struct(seed, profitTwo, profitDBTypes, false, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = profitOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = profitTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 2 {
		t.Error("want 2 records, got:", count)
	}
}

func testProfitsInsert(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testProfitsInsertWhitelist(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Whitelist(profitColumnsWithoutDefault...)); err != nil {
		t.Error(err)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testProfitsReload(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = o.Reload(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testProfitsReloadAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := ProfitSlice{o}

	if err = slice.ReloadAll(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testProfitsSelect(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := Profits().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 1 {
		t.Error("want one record, got:", len(slice))
	}
}

var (
	profitDBTypes = map[string]string{`ReferralAddress`: `character varying`, `Level`: `bigint`, `UserAddress`: `character varying`, `Time`: `bigint`, `Amount`: `bigint`}
	_             = bytes.MinRead
)

func testProfitsUpdate(t *testing.T) {
	t.Parallel()

	if 0 == len(profitPrimaryKeyColumns) {
		t.Skip("Skipping table with no primary key columns")
	}
	if len(profitAllColumns) == len(profitPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, profitDBTypes, true, profitPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	if rowsAff, err := o.Update(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only affect one row but affected", rowsAff)
	}
}

func testProfitsSliceUpdateAll(t *testing.T) {
	t.Parallel()

	if len(profitAllColumns) == len(profitPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &Profit{}
	if err = randomize.Struct(seed, o, profitDBTypes, true, profitColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, profitDBTypes, true, profitPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	// Remove Primary keys and unique columns from what we plan to update
	var fields []string
	if strmangle.StringSliceMatch(profitAllColumns, profitPrimaryKeyColumns) {
		fields = profitAllColumns
	} else {
		fields = strmangle.SetComplement(
			profitAllColumns,
			profitPrimaryKeyColumns,
		)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	typ := reflect.TypeOf(o).Elem()
	n := typ.NumField()

	updateMap := M{}
	for _, col := range fields {
		for i := 0; i < n; i++ {
			f := typ.Field(i)
			if f.Tag.Get("boil") == col {
				updateMap[col] = value.Field(i).Interface()
			}
		}
	}

	slice := ProfitSlice{o}
	if rowsAff, err := slice.UpdateAll(ctx, tx, updateMap); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("wanted one record updated but got", rowsAff)
	}
}

func testProfitsUpsert(t *testing.T) {
	t.Parallel()

	if len(profitAllColumns) == len(profitPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	// Attempt the INSERT side of an UPSERT
	o := Profit{}
	if err = randomize.Struct(seed, &o, profitDBTypes, true); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Upsert(ctx, tx, false, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert Profit: %s", err)
	}

	count, err := Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}

	// Attempt the UPDATE side of an UPSERT
	if err = randomize.Struct(seed, &o, profitDBTypes, false, profitPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize Profit struct: %s", err)
	}

	if err = o.Upsert(ctx, tx, true, nil, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert Profit: %s", err)
	}

	count, err = Profits().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}
}
