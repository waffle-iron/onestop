# Releasing OneStop

This is our official process for releasing new versions of OneStop.


## Table of contents
1. [Principles](#principles)
1. [Versioning](#versioning)
  1. [What is a release?](#what-is-a-release)
  1. [The public API](#the-public-api)
1. [Release process](#release-process)
  1. [Git[hub] workflow](#git-workflow)
1. [Questions?](#questions)


## Principles
1. Follow well-established [versioning practices](#versioning)
1. Provide detailed notes for each [release](#what-is-a-release)
1. Encourage contributions and thank contributors for their hard work


## Versioning
[Semantic versioning][semver] is a method of numbering release versions that
aims to help users understand the implications of upgrading from one
[release](#what-is-a-release) to another. Semantic version numbers take the
form `major.minor.patch`, where:

* Bug fixes increment the `patch` number (e.g. `1.0.0` to `1.0.1`)
* New features increment the `minor` number and reset `patch` (e.g. `1.0.1` to
  `1.1.0`)
* Changes to the [public API](#public-api) (breaking changes) increment the
  `major` version and reset `minor` and `patch` (e.g. `1.1.2` to `2.0.0`)

### What is a release?
Technically, release of OneStop core code "lives" in two
different places:

1. On GitHub (preferred) as a [tag][git tag] and corresponding [release][releases]
1. In [JFrog Artifactory][jfrog]

### The public API
*Placeholder. This is planned and will be outlined in greater detail when it
becomes available*

## Release process

### Git workflow

* We have two main branches that are never deleted:
  * `master` always points to the latest release
  * `develop` contains changes being prepped for a release

* When introducing a change (feature, bug fix, etc.):

  1. Branch off `develop`:

      ```sh
      git fetch origin
      git checkout -b feature/foo origin/develop
      ```

  1. As a naming convention, your branch name can be anything except `master`,
     `develop`, or with the `release/` or `hotfix/` prefix

  1. Changes are merged back into the `develop` branch

* When publishing a new release:

  1. Branch off `develop` and use the branch name format `release/{version}`,
     e.g.

      ```sh
      git fetch origin
      git checkout -b release/1.0.0 origin/develop
      ```

  1. Update the following version locations:
    1. Client: version updated in `package.json` file
    1. Base project: version updated in the top-level `build.gradle` file
  1. Open a [pull request] from your `release/` branch to merge into `master`.
     List the key changes for a release in the pull request description. (The
     diff will show you exactly what has changed since the previous release.)

  1. Tag the release on the `master` branch **or** create the tag when you
     draft the release notes.

  1. Merge the release commits back into `develop` from `master` with a [pull
     request].

  1. Write the release notes on GitHub:

    1. [Draft the release][draft release] from the corresponding tag on the
       `master` branch.

    1. Have at least one team member review the release notes.

    1. Publish the [release](https://github.com/cires-ncei/onestop/releases)
       on GitHub.


## Questions?
If you need help or have any questions, please reach out to us by filing an [issue on GitHub][github issues].


[draft release]: https://github.com/cires-ncei/onestop/releases/new
[git tag]: https://git-scm.com/book/en/v2/Git-Basics-Tagging
[new release]: https://github.com/cires-ncei/onestop/releases/new
[pull request]: https://github.com/cires-ncei/onestop/compare
[releases]: https://github.com/cires-ncei/onestop/releases
[semver]: http://semver.org/
[jfrog]: https://oss.jfrog.org/artifactory/webapp/#/home
[github issues]: https://github.com/cires-ncei/onestop/issues/new
