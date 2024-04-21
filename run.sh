tmux new-session -d -s life-repo 'cd life-repo-app && npm run ios'
tmux split-window -h -t life-repo 'cd life-repo-server && uvicorn main:app --reload'
tmux split-window -v -t life-repo:0.1 'zrok share public http://127.0.0.1:8000'
tmux -2 attach-session -d -t life-repo
