# Changelog

## [2.0.1] - 2024-03-22

### Frontend:
- Removed fixed Header, implemented a responsive header alternative with a dropdown menu.
- Upgraded Tailwind to version 3.
- Refactored IFC Viewer code

### Backend:
- Fixed bug in Subproject deletion, and get learning by id


## [2.0.0] - 2024-03-21

### Frontend:
- Upgraded Vue to version 2.7.16 to align with the latest security and performance improvements.
- Added `vite` and `vite-plugin-vue2` to the latest versions for faster development and build times.
- Removed Babel due to its lack of vite support
- Replaced Vue Image Markup with native implementation


### Backend:
- Upgraded to NestJS v10 to leverage the latest improvements and security enhancements of the framework.
- Updated all project dependencies to their latest versions to ensure compatibility with NestJS v10 and address security vulnerabilities.
- Fixed various bugs that were identified during the upgrade process, improving the overall stability and performance of the application.
- Removed database seeding functionality due to lack of support in the new ecosystem

### Misc:
- Created new Dockerfiles configured for Node.js 18, optimizing container performance and compatibility with the latest Node.js features.
- Switched to pnpm as the package manager to efficient handling of monorepos.



## [1.3.4] - 2022-07-04

### Frontend:

feat: added rotation for Subprojects

fix: pulled position checfix: pulled position checkk

feat: IFCPort rotate object

feat: IFCPort rotate Object

feat: load saved Subprojects position list

style: SavedViews add Screenshot

fix: call reload Subprojects on render

style: load Subprojects history list

### Backend:

feat: get list of history subproject positions

## [1.3.3] - 2022-06-27

style: buttons Subprojects

feat: position SubprojectPostitionModal

fix: set new Position

fix: load position when reload

## [1.3.2] - 2022-06-25

### Frontend:

fix: check for existing subprojects, after pulling positions

feat: unload all Subprojects

fix: load initial subproject position, based on parentProject

## [1.3.1] - 2022-06-14

### Frontend:

refactor: viewport connections & cleanup

fix: IFC Viewport, dont move parent project

feat: move existings subprojects

### Backend:

test: viewport emit implementation

refactor: joining and leaving viewport

refactor: disconnect viewport

feat: updated emit viewport


## [1.3.0] - 2022-06-08

### Frontend:

style: edit Subprojects load

func: store and save position

func: save position in store, for server requests

fix: otherCamPostitin undefined error

feat: push & pull Subproject position

style: save button position

### Backend:

migration: added view table

feat: added view module

fix: project file controller param #35

## [1.2.7] - 2022-06-04

func IFCPort select and move model

func: classic viewport added move/select objects

## [1.2.6] - 2022-06-01

fix: changed lights , changed submodel positions

fix: remove Subprojects from scene

fix: IFC Upload more detail err message


## [1.2.5] - 2022-05-30

func: three ifc loader

install: added wasm for ifc import

added IFC Test view

func:added IFCPort

func: added ifcloader for subprojects

style: active viewport button

## [1.2.4] - 2022-05-25

added updates22

added vetur files

func: added tab view

fix: chatroom flex sroll

style: list for Subprojects

func: store Subprojects dispatch

test vmodel

fix asc chatlog

func: select subprojects

rm and add projects

## [1.2.3] - 2022-05-15
### Added
- func: delete subprojects

## [1.1.1] - 2020-05-03
### Fixed
-  style: added base style; code pre h1 h2 h3
-  fix: changelog in dev env
-  fix: delete user from viewport on room change
-  fix: socket viewport fixes


## [1.1.0] - 2020-04-26
### Added
- func: uploadProfileImage
- func: edit profile
- func: added Profile
- style: chat list

### Fixed
- fix: screenshot annotate #44
- style: small fixes
- Vue Moment Fix
