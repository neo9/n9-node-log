

# [5.0.0-rc.6](https://github.com/neo9/n9-node-log/compare/5.0.0-rc.5...5.0.0-rc.6) (2023-10-13)


### yarn

* Upgrade dependencies ([673e1d2](https://github.com/neo9/n9-node-log/commit/673e1d2660a2d11d5aefc2c0f37f55f731e7424b))
* Upgrade dependencies and remove codecov one #29 ([889eaeb](https://github.com/neo9/n9-node-log/commit/889eaeb4a28123674a77bc1d027d63af44a7eaee)), closes [#29](https://github.com/neo9/n9-node-log/issues/29)

# [5.0.0-rc.5](https://github.com/neo9/n9-node-log/compare/5.0.0-rc.4...5.0.0-rc.5) (2023-10-09)


### context

* Fix support of functions bigint and symbols to avoid circles ([97a8807](https://github.com/neo9/n9-node-log/commit/97a8807561b52eb3703bfef03165047dbdb2ede6))

# [5.0.0-rc.4](https://github.com/neo9/n9-node-log/compare/5.0.0-rc.3...5.0.0-rc.4) (2023-10-09)


### context

* Fix support of circular objects ([3fb1419](https://github.com/neo9/n9-node-log/commit/3fb14194c2b064a51b8da445222244e914f16462))

# [5.0.0-rc.3](https://github.com/neo9/n9-node-log/compare/5.0.0-rc.2...5.0.0-rc.3) (2023-10-04)


### errors

* Add support of extra error properties like in N9Error ([fbcd3ec](https://github.com/neo9/n9-node-log/commit/fbcd3ecd5f406f7076d4b391aa4cba509b929747))

# [5.0.0-rc.2](https://github.com/neo9/n9-node-log/compare/5.0.0-rc.1...5.0.0-rc.2) (2023-10-04)


### errors

* Change errors representation name to type as pino did ([8f23b7f](https://github.com/neo9/n9-node-log/commit/8f23b7fc3b102ffbc59c793b2a4d48efb8fc1af4))

# [5.0.0-rc.1](https://github.com/neo9/n9-node-log/compare/5.0.0-rc.0...5.0.0-rc.1) (2023-10-03)


### filters

* Add support of filters that return undefined ([e1d9534](https://github.com/neo9/n9-node-log/commit/e1d95343b553e8905fb558ae3aff914f35d800eb))

# [5.0.0-rc.0](https://github.com/neo9/n9-node-log/compare/4.1.0...5.0.0-rc.0) (2023-10-03)


### node

* Drop support of node 14 and add node 18 and 20 #27 ([b031ef7](https://github.com/neo9/n9-node-log/commit/b031ef72b17402ffc10361aa035c400f9a978591)), closes [#27](https://github.com/neo9/n9-node-log/issues/27)

### release

* Fix release-it command ([9eefc14](https://github.com/neo9/n9-node-log/commit/9eefc14dc53128774ee5f0c2f5a71175dd6d87a9))
* Upgrade release-it configuration ([2ca9e9f](https://github.com/neo9/n9-node-log/commit/2ca9e9f3a83fd0636f4940202a75a10db6e769ed))

### tests

* Remove lint and build from test command ([b6fb848](https://github.com/neo9/n9-node-log/commit/b6fb848d1412d2a98bfab1f0c46b7f7f55e0fcad))

### yarn

* Remove pino and log by itself #28 ([ab4d466](https://github.com/neo9/n9-node-log/commit/ab4d466f00366444e34dacab3e89bb9b21a4c800)), closes [#28](https://github.com/neo9/n9-node-log/issues/28)

# [4.1.0](https://github.com/neo9/n9-node-log/compare/4.0.1...4.1.0) (2022-12-05)


### getters

* Add getters on constructor options ([43fc8f2](https://github.com/neo9/n9-node-log/commit/43fc8f25e2de490d374aefee7345db3e06cdd5e4))
* Remove unnecessary getters ([82b8da2](https://github.com/neo9/n9-node-log/commit/82b8da213bf767b37599f664407bbb095ee6c09e))

### yarn

* Upgrade parse-url from 6.0.0 to 6.0.5 ([3cda4a4](https://github.com/neo9/n9-node-log/commit/3cda4a48f021801753b6d6abd5cd671b0724387e))
* Upgrade semver-regex from 3.1.3 to 3.1.4 ([9a8ddb8](https://github.com/neo9/n9-node-log/commit/9a8ddb80000cd47bf8db3db23e95b8876253634d))

## [4.0.1](https://github.com/neo9/n9-node-log/compare/4.0.0...4.0.1) (2022-05-02)


### memory

* Fix module creation by re-using the parent one ([e4780b1](https://github.com/neo9/n9-node-log/commit/e4780b1b376ef66659e3ad8f0ac9272499951b8c))

### module

* Restore options parameter on module creation ([98d7326](https://github.com/neo9/n9-node-log/commit/98d7326995b9a7bc5f28f4ec8831977255f1e2a5))

# [4.0.0](https://github.com/neo9/n9-node-log/compare/4.0.0-rc.3...4.0.0) (2022-04-27)


### filters

* Improve filters application ([f8b6b1d](https://github.com/neo9/n9-node-log/commit/f8b6b1d2855e8ed31a460eb114a0f0e962c3924a))

# [4.0.0-rc.3](https://github.com/neo9/n9-node-log/compare/4.0.0-rc.2...4.0.0-rc.3) (2022-04-27)


### filters

* Add filters working with pino hook ([798f255](https://github.com/neo9/n9-node-log/commit/798f25533ffed8996ef3e2a1057aee9796843de3))

# [4.0.0-rc.2](https://github.com/neo9/n9-node-log/compare/4.0.0-rc.1...4.0.0-rc.2) (2022-04-27)


### format

* Rename time key to timestamp to not change from version 3 ([4626861](https://github.com/neo9/n9-node-log/commit/462686129cb0de2becf2967627b025af4476babc))

# [4.0.0-rc.1](https://github.com/neo9/n9-node-log/compare/4.0.0-rc.0...4.0.0-rc.1) (2022-04-27)


### env

* Add warning outside dev env if using pino-pretty ([000cd77](https://github.com/neo9/n9-node-log/commit/000cd77e782b006efa725d24301850eb74e77099))

# [4.0.0-rc.0](https://github.com/neo9/n9-node-log/compare/3.2.1...4.0.0-rc.0) (2022-04-26)


### yarn

* Use pino instead of winston ([425e1c7](https://github.com/neo9/n9-node-log/commit/425e1c7693bb7560ed6b0e724bb5e339586c908a))

## [3.2.1](https://github.com/neo9/n9-node-log/compare/3.2.0...3.2.1) (2022-04-25)


### build

* Use github-actions for build instead of travis ([3906366](https://github.com/neo9/n9-node-log/commit/3906366ca60b34cfe8b2166d884d6d9ea9f565d0))

### lint

* Use eslint instead of tslint with n9-coding-style ([170c832](https://github.com/neo9/n9-node-log/commit/170c832ce760f156695595baae8bca4adc3f3007))

### yarn

* Upgrade dependencies ([13d5447](https://github.com/neo9/n9-node-log/commit/13d54477d9d33e8012483549da5a12b25b28b6f8))
* Upgrade indirect dependencies for security issues ([41dac39](https://github.com/neo9/n9-node-log/commit/41dac39ae6b93b68627aebd6bfe487af3f8b69a5))

# [3.2.0](https://github.com/neo9/n9-node-log/compare/3.1.1...3.2.0) (2021-05-18)


### node

* Drop support of node 10 and add node 16 ([a6ae8f3](https://github.com/neo9/n9-node-log/commit/a6ae8f3660700e5443036943f0a947749a9f6351))

### yarn

* Update dependencies ([e9b63fc](https://github.com/neo9/n9-node-log/commit/e9b63fc49589d6373de35bfdcec1297cb3128285))

## [3.1.1](https://github.com/neo9/n9-node-log/compare/3.1.0...3.1.1) (2020-11-19)


### types

* Fix level namespace ([3b4a23b](https://github.com/neo9/n9-node-log/commit/3b4a23bce3b5d4c6e48ee6080a57563692bfb3f1))

# [3.1.0](https://github.com/neo9/n9-node-log/compare/3.0.0...3.1.0) (2020-11-19)


### doc

* Improve readme documentation ([1a98b77](https://github.com/neo9/n9-node-log/commit/1a98b77b7b5457c68c9e401f7c8706f1ad21d49c))

### format

* Fix formatting ([fe9ace5](https://github.com/neo9/n9-node-log/commit/fe9ace5705c938ba8d30340a8cd23036e85ca915))

### levels

* Add function is level enabled ([566754d](https://github.com/neo9/n9-node-log/commit/566754d330cc2c5790f9b3614dbcd79f653c208c))

# [3.0.0](https://github.com/neo9/n9-node-log/compare/3.0.0-rc.4...3.0.0) (2020-09-23)

# [3.0.0-rc.4](https://github.com/neo9/n9-node-log/compare/3.0.0-rc.3...3.0.0-rc.4) (2020-09-23)


### yarn

* Upgrade all dependencies except winston ([d6ab65a](https://github.com/neo9/n9-node-log/commit/d6ab65a8a190c13ccdee7739e364ad03efaf4ef9))

# [3.0.0-rc.3](https://github.com/neo9/n9-node-log/compare/3.0.0-rc.2...3.0.0-rc.3) (2020-09-23)


### yarn

* Upgrade release-it and its dependencies ([20edcce](https://github.com/neo9/n9-node-log/commit/20edcce7459606bfd35a431c96e2c94810682962))

# [3.0.0-rc.2](https://github.com/neo9/n9-node-log/compare/3.0.0-rc.1...3.0.0-rc.2) (2020-09-23)


### travis

* Add build on nodejs 14 ([9ea9e6c](https://github.com/neo9/n9-node-log/commit/9ea9e6c8437b16dbeea0fd57c45434112d7d5893))

### yarn

* Fix repositories urls ([0868f11](https://github.com/neo9/n9-node-log/commit/0868f1122d84d41b80e10a85562bff88e9a8d7c6))
* Fix upgrade winston to v 2.4.5 to fix nodejs 14 warning ([9c94ac7](https://github.com/neo9/n9-node-log/commit/9c94ac79971b8342900a6b63795a5cf7221e37f4))
* Upgrade winston to v 2.4.5 to fix nodejs 14 warning ([a6dc772](https://github.com/neo9/n9-node-log/commit/a6dc772d233fe04e3d5de630f723a96de8491891))

# [3.0.0-rc.1](https://github.com/neo9/n9-node-log/compare/3.0.1-0...3.0.0-rc.1) (2020-04-06)

## [3.0.1-0](https://github.com/neo9/n9-node-log/compare/3.0.0-rc.0...3.0.1-0) (2020-04-06)


### release

* Fix tag name ([8335090](https://github.com/neo9/n9-node-log/commit/8335090c9615c569b144ec8c0bd9d95991659944))

# [3.0.0-rc.0](https://github.com/neo9/n9-node-log/compare/v2.4.0...v3.0.0-rc.0) (2020-04-06)


### doc

* Fix default level ([6627851](https://github.com/neo9/n9-node-log/commit/662785183de44005f50c82c48014e6932fb35262))
* Fix typo ([7295464](https://github.com/neo9/n9-node-log/commit/7295464a3373961ca515bc449f89abaa6e70ff60))

### filters

* Add winston filters ([e08c66c](https://github.com/neo9/n9-node-log/commit/e08c66c4467adbb1297608301b15fbd29c41b6f9))
* Fix stream support for morgan and filters ([c26e93c](https://github.com/neo9/n9-node-log/commit/c26e93c65348a4137b24590923c5cf91a3905321))

### format

* Add formatJSON option ([300bfa5](https://github.com/neo9/n9-node-log/commit/300bfa53890c5dbc36d27cc7249a11a10064db46))

### options

* Keep N9Log options to new module ([08a520b](https://github.com/neo9/n9-node-log/commit/08a520b39984190eec3ee48d719adea0aaf9c76d))

### package

* Revert version upgrade ([b0f7ce6](https://github.com/neo9/n9-node-log/commit/b0f7ce6f4969b473df00322e2cffabb7b1a42bee))

### src

* Update default log level to info ([8f3bb35](https://github.com/neo9/n9-node-log/commit/8f3bb358da73d52840eecdf319b1047607e8a858))

### tools

* Upgrade all tools around code and most of dep drop support of node 8 ([4d5931f](https://github.com/neo9/n9-node-log/commit/4d5931fbbad72e9732f80b86ae1c8bec7c079edb))

### versions

* Update to 2.5.2 ([3cefaec](https://github.com/neo9/n9-node-log/commit/3cefaeccdaabea5004e5da552590bfd9467befc8))
* Update to 2.6.0 ([dbd11ae](https://github.com/neo9/n9-node-log/commit/dbd11ae9980b302a3d706f151dff4fcf806c1358))



# [2.4.0](https://github.com/neo9/n9-node-log/compare/v2.3.1...v2.4.0) (2017-10-19)


### minor

* Add options.transports option ([9725395](https://github.com/neo9/n9-node-log/commit/97253959e459d17c7de8fa001611cbd4a8f7cf1b))



## [2.3.1](https://github.com/neo9/n9-node-log/compare/v2.3.0...v2.3.1) (2017-08-30)




# [2.3.0](https://github.com/neo9/n9-node-log/compare/v2.2.2...v2.3.0) (2017-08-30)


### add

* Travis & Codecov badges ([89fcd2f](https://github.com/neo9/n9-node-log/commit/89fcd2f15c042ff028061924ae388892f24026f7))
* Travis for testing ([bcb0f89](https://github.com/neo9/n9-node-log/commit/bcb0f89c3a8ca0b807b8abab2dd8e1ab6164bcd6))

### change

* Verbose is the new default ([91f127a](https://github.com/neo9/n9-node-log/commit/91f127af3fbea660174bf4282ecdab1627d64bed))

### fix

* Remove sonar ([7a626a9](https://github.com/neo9/n9-node-log/commit/7a626a9ebba0051f89f9430020fe03021a03e61c))

### update

* README ([dfdb412](https://github.com/neo9/n9-node-log/commit/dfdb412ac592fc045f4ecb5dc5c587d2b06dff01))



## [2.2.2](https://github.com/neo9/n9-node-log/compare/v2.2.1...v2.2.2) (2017-08-29)


### tag

* 2.2.2 release ([69016e7](https://github.com/neo9/n9-node-log/commit/69016e7afc73a000ba1ac2b4c44ce84a751894af))



## [2.2.1](https://github.com/neo9/n9-node-log/compare/v2.2.0...v2.2.1) (2017-06-30)


### fix

* Remove last eol in stream method ([958bb61](https://github.com/neo9/n9-node-log/commit/958bb61f1607f2fc7a5b4ce18f4f95414c27620e))

### tag

* 2.2.1 release ([876a159](https://github.com/neo9/n9-node-log/commit/876a1597265f6ad1fe872e74af636e933eac797c))

### yarn

* Remove ([f3924bf](https://github.com/neo9/n9-node-log/commit/f3924bf6dfb371bc6431f4a06ba322c840906b20))



# [2.2.0](https://github.com/neo9/n9-node-log/compare/v2.1.0...v2.2.0) (2017-06-29)


### tag

* 2.2.0 release ([769adc1](https://github.com/neo9/n9-node-log/commit/769adc15b2e2c9706b7e111ed7ac9dd841476e9a))



# [2.1.0](https://github.com/neo9/n9-node-log/compare/v2.0.0...v2.1.0) (2017-06-27)


### feat

* Add trace & debug log levels ([2cb8c22](https://github.com/neo9/n9-node-log/commit/2cb8c22bd3bcff10819b1e1efd3dc97a4d2b9aba))

### fix

* use verbose instead of trace and fix tests ([571e7d2](https://github.com/neo9/n9-node-log/commit/571e7d28cfa0c3955b8f92e0dff5a4d852a8da0b))

### tag

* 2.1.0 release ([8ff7869](https://github.com/neo9/n9-node-log/commit/8ff78697fb13796f182cefbb4b620dc6da5bb3ee))



# [2.0.0](https://github.com/neo9/n9-node-log/compare/v1.1.4...v2.0.0) (2017-05-18)


### feature

* use n9Log() instead of new N9Log() ([3f39302](https://github.com/neo9/n9-node-log/commit/3f39302cd711b8721b49a1fdc436aca50cd708c2))

### package

* Update package description ([96dd053](https://github.com/neo9/n9-node-log/commit/96dd053f29b3297cba7d575ea096c7e1c1c75d44))

### tag

* 2.0.0 release ([8111d19](https://github.com/neo9/n9-node-log/commit/8111d19bdc49f1bd19243721d83a7892556a9189))



## [1.1.4](https://github.com/neo9/n9-node-log/compare/v1.1.3...v1.1.4) (2017-05-18)


### gitignore

* Add sonar-project.properties ([3b6b615](https://github.com/neo9/n9-node-log/commit/3b6b6151b771b656cc3431dea5b4d5b783770dc4))

### package

* Add sonar-generate ([9b75904](https://github.com/neo9/n9-node-log/commit/9b759048e67e1a17c9b6f6557421a6051fbad7fe))

### sonar

* Add projectname ([a702335](https://github.com/neo9/n9-node-log/commit/a702335ebc1e0b7cef63616861f83c03ee1a41f2))
* delete project file ([123498c](https://github.com/neo9/n9-node-log/commit/123498cd004991ad077de2d9d4bc7c2a559e01af))

### tag

* 1.1.4 release ([3df13da](https://github.com/neo9/n9-node-log/commit/3df13dae4f20a1d5893ba7178a5155eb60e62750))



## [1.1.3](https://github.com/neo9/n9-node-log/compare/v1.1.2...v1.1.3) (2017-05-17)


### package

* ship winston types too ([c9a30d9](https://github.com/neo9/n9-node-log/commit/c9a30d99551069bb0eb0ef64e1750da5a00fc4bf))

### readme

* Fix instanciation ([2a295f5](https://github.com/neo9/n9-node-log/commit/2a295f5031ebcaa91fd03a36977b08476e7b022a))

### sonar

* update projectKey ([a12ec42](https://github.com/neo9/n9-node-log/commit/a12ec42acfccd6100e965a0d01ffd9ef98c792d2))

### tag

* 1.1.3 release ([414f5e0](https://github.com/neo9/n9-node-log/commit/414f5e0d5bde58fce34f9539a5b0c683d3d0723f))



## [1.1.2](https://github.com/neo9/n9-node-log/compare/v1.1.1...v1.1.2) (2017-05-15)


### fix

* Typo bullet points ([9d3baa9](https://github.com/neo9/n9-node-log/commit/9d3baa9196fad721e17f5f300d94f541610a7abb))
* Typo tabs README ([2f76c58](https://github.com/neo9/n9-node-log/commit/2f76c58fe65982230730b4b6b7909e5b093bd5d4))

### tag

* 1.1.2 release ([a0851f2](https://github.com/neo9/n9-node-log/commit/a0851f232393fcc9d3baa59167eaf23b165d3f0f))



## [1.1.1](https://github.com/neo9/n9-node-log/compare/v1.1.0...v1.1.1) (2017-05-15)


### package

* Move dependencies to dev ([f280dab](https://github.com/neo9/n9-node-log/commit/f280dabc3a12c23bbfb3f10a0ac3fe45d7ef0fca))

### tag

* 1.1.1 release ([e30d2c5](https://github.com/neo9/n9-node-log/commit/e30d2c54e7f095ad2bfcd6e7e3a9626f8342e133))



# [1.1.0](https://github.com/neo9/n9-node-log/compare/v1.0.0...v1.1.0) (2017-05-12)


### feat

* Add timestamp in console logs ([3cbabdc](https://github.com/neo9/n9-node-log/commit/3cbabdc47d4880a0b0f8406293d3b5829daa442f))

### tag

* 1.1.0 release ([cf279e8](https://github.com/neo9/n9-node-log/commit/cf279e80cda62b6d555c2ebdb074e158fe246865))



# [1.0.0](https://github.com/neo9/n9-node-log/compare/v0.1.0...v1.0.0) (2017-05-12)


### base

* Add sonar scanner ([df4715c](https://github.com/neo9/n9-node-log/commit/df4715c4bbcffc84e5d9507eb4e67d5003cf5a0c))
* Types definition and profiling ([3995efe](https://github.com/neo9/n9-node-log/commit/3995efe117bd53fdc9e1ec026ad21b8e87671e1f))

### tag

* 1.0.0 release ([6271f80](https://github.com/neo9/n9-node-log/commit/6271f80511b10943cb7160f39c62d376885e5b73))



# [0.1.0](https://github.com/neo9/n9-node-log/compare/3d22d357685aa8bf31e150bfe36da3d4796a6e98...v0.1.0) (2017-05-12)


### base

* n9-node-logs ready ([3d22d35](https://github.com/neo9/n9-node-log/commit/3d22d357685aa8bf31e150bfe36da3d4796a6e98))

### fix

* Add preversion script ([7941d35](https://github.com/neo9/n9-node-log/commit/7941d35381d23fbe616847cc064d033c4ffeee16))
* httpOptions ([73b225c](https://github.com/neo9/n9-node-log/commit/73b225c3da605e3a2df33bf6aa4f798a273a0eaf))

### package

* Add prepublish script ([c86deb3](https://github.com/neo9/n9-node-log/commit/c86deb32592afed9f0550965c786d0b764157ad3))

### style

* fix Mardown ([54577ce](https://github.com/neo9/n9-node-log/commit/54577ce9c66caeaad5d28bd42c1fd8007f8ba76b))

### tag

* 0.1.0 release ([211369b](https://github.com/neo9/n9-node-log/commit/211369b591e9d0df5f6b1a52e5c3c12b44355489))