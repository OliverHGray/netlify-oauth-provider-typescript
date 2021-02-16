import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';
import { name, version } from '../package.json';

const infra = new pulumi.StackReference(`OliverHGray/infrastructure/${pulumi.getStack()}`);
const repo = infra.getOutput('dockerRepo') as pulumi.Output<gcp.artifactregistry.Repository>;

const image = new docker.Image(`${name}-image`, {
    imageName: pulumi.interpolate`${repo.location}-docker.pkg.dev/${gcp.config.project}/${repo.repositoryId}/${name}:v${version}`,
    build: {
        context: '../',
    },
});

const serviceAccount = new gcp.serviceaccount.Account(`${name}-account`, {
    accountId: name,
    displayName: name,
});

const role = new gcp.projects.IAMCustomRole(`${name}-role`, {
    title: `${name} Custom Role`,
    roleId: name.replace(/-/g, '.'),
    permissions: [
        'secretmanager.versions.access',
        'firebaseauth.configs.get',
        'firebaseauth.users.get',
        'identityplatform.workloadPoolProviders.get',
        'identityplatform.workloadPoolProviders.list',
        'identityplatform.workloadPools.get',
        'identityplatform.workloadPools.list',
    ],
});

new gcp.projects.IAMMember(`${name}-role-member`, {
    member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
    role: pulumi.interpolate`projects/${role.project}/roles/${role.roleId}`,
});

const service = new gcp.cloudrun.Service(`${name}-service`, {
    name: `${name}`,
    location: 'europe-west1',
    template: {
        spec: {
            containers: [
                {
                    image: image.imageName,
                    envs: [
                        {
                            name: 'MONGODB_URI',
                            value: `projects/${gcp.config.project}/secrets/DEFAULT_MONGODB_URI/versions/latest`,
                        },
                    ],
                },
            ],
            serviceAccountName: serviceAccount.email,
        },
    },
});

export const url = service.statuses[0].url;
