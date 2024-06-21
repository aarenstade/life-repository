tmux new-session -d -s life-repo 'zrok share public http://127.0.0.1:8000'
tmux -2 attach-session -d -t life-repo
