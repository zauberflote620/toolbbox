1. ask user whether they would like a or b

a. create a worktree with an existing branch
git worktree add ../YYMMDD_project-bugfix bugfix-123

b. # Create a new worktree with a new branch 
git worktree add ../[YYMMDD]_project-feature-a -b feature-a

2. cd to the new worktree


# Remember to initialize your development environment in each new worktree according to your project’s setup. Depending on your stack, this might include:
JavaScript projects: Running dependency installation (npm install, yarn)
Python projects: Setting up virtual environments or installing with package managers
Other languages: Following your project’s standard setup process
