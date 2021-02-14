# typescript-express-template

Template backend service repository.

After generating a repository from the template:

- Change the name and description in `package.json`
- Change the name and description in `Pulumi.yaml`
- Create the Pulumi stacks by running the following commands:
    - `pulumi stack init dev`
- To enable deployment on merge to master, uncomment the last step in the GitHub Action workflow
- Remove these instructions and write your own README