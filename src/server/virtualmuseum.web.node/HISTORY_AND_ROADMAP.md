# Roadmap

## Next steps

### 1. Add the following commands:

- CreateTenantCommand
- RenameTenantCommand
- DeleteTenantCommand
- CreateRoomCommand
- RenameRoomCommand
- DeleteRoomCommand
- CreateTopographicalTableCommand
- RenameTopographicalTableCommand
- MoveTopographicalTableCommand
- DeleteTopographicalTableCommand
---
- AddMediaFileCommand
- RenameMediaFileCommand
- ChangeMediaFileTypeCommand
- ChangeMediaFileDurationCommand
- DeleteMediaFileCommand
---
- CreateMultiMediaPresentationCommand
- RenameMultiMediaPresentationCommand
- DeleteMultiMediaPresentationCommand
- AddPresentationItemCommand
- RenamePresentationItemCommand
- DeletePresentationItemCommand
- MovePresentationItemCommand
- ChangePresentationItemDurationCommand
- ChangePresentationItemSequenceCommand
---
... More to be defined.

### 2. Create UI for the apo using these commands and queries

Idea: Create a mockup and let the initial UI be created with V0. Then
move code here and connect to backend.

### 3. Containerize the app

### 4. Create a build pipeline in Github

### 5. Create a deployment pipeline - deploy the app to a good location


# History

## 2024-11-22 - added topographical table endpoint
/api/v1/topopgraphical-tables/:topographicalTableId
--> returns the topographical table with all its topics and time series, geo events and multimedia presentations (main endpoint for the app)

## 2024-11-20 - initial setup with windsurf.ai

nodejs, typescript, express, sqlite application.

Database is already final for now. Created endpoints for querying of tenants, multiMediaPresentations and TimeSeries inclusing unit tests.

To add a  new endpoint, take the following steps:

1. Define new DTO types in src/types/dto/"new-types".ts
2. Add swagger definition for new types in src/types/swagger/"new-types".ts
3. Add query to src/services/database.service.ts
4. Add controller to src/controllers/"new-controller".ts
5. Add route to src/routes/"new-route".ts
6. Add new route to src/app.ts

----
7. Add test data to the tests/helpers/test-database.ts
8. Add tests in tests/unit/routess and tests/unit/services. 

Make sure that all tests are green and that the endpoints in swagger work as expected.

Run tests in one console with "npm run test:coverage:interactive" 
Run the server in another console with "npm run dev"