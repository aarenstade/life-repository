tmux new-session -d -s life-repo 'cd server && uvicorn main:app --reload'
tmux split-window -v -t life-repo:0.0 'zrok share public http://127.0.0.1:8000'
tmux -2 attach-session -d -t life-repo
