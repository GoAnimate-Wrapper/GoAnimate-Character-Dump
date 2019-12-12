#!/usr/bin/env bash
git init
git remote add origin https://github.com/Windows81/GoAnimate-Character-Dump.git
git reset FETCH_HEAD --soft
git checkout master *.*
npm start "$@"