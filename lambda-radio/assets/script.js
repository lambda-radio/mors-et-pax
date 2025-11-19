const tracks = [
        { id: 'audio1', file: 'tracks/main/eerie.m4a' },
        { id: 'audio2', file: 'tracks/main/godhelpufr.m4a' }
      ];

      const instrumentalTracks = [
        { id: 'instr1', file: 'tracks/instrumental/redd.m4a' },
        { id: 'instr2', file: 'tracks/instrumental/spookier.m4a' }
      ];

      const miniTracks = [
        /*{ id: 'mini1', file: 'tracks/mini/mini.m4a' }*/
      ];

      const allTracks = [...tracks, ...instrumentalTracks, ...miniTracks];

      function createPlayer(track, index) {
        const playerContainer = document.createElement('div');

        const pathParagraph = document.createElement('p');
        pathParagraph.textContent = track.file;
        pathParagraph.style.fontStyle = 'italic';
        pathParagraph.style.fontSize = '0.8em';
        playerContainer.appendChild(pathParagraph);

        const playerDiv = document.createElement('div');
        playerDiv.className = 'retro-player';

        const audio = document.createElement('audio');
        audio.id = track.id;
        audio.src = track.file;
        audio.type = 'audio/mp4';
        playerDiv.appendChild(audio);

        const button = document.createElement('button');
        button.className = 'play-btn';
        button.id = 'btn' + index;
        button.textContent = 'Play';
        button.onclick = () => togglePlay(track.id, button.id);
        playerDiv.appendChild(button);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.addEventListener('click', (e) => seek(e, track.id));

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.id = 'progress' + index;
        progressContainer.appendChild(progressBar);
        playerDiv.appendChild(progressContainer);

        audio.addEventListener('timeupdate', () => updateProgress(track.id, progressBar.id));
        audio.addEventListener('ended', () => playNext(index));

        playerContainer.appendChild(playerDiv);
        return playerContainer;
      }

      function togglePlay(audioId, btnId) {
        const audio = document.getElementById(audioId);
        const btn = document.getElementById(btnId);

        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach(a => {
          if (a.id !== audioId) {
            a.pause();
          }
        });

        const allButtons = document.querySelectorAll('.play-btn');
        allButtons.forEach(b => {
          if (b.id !== btnId) {
            b.textContent = 'Play';
          }
        });

        if (audio.paused) {
          audio.play();
          btn.textContent = 'Pause';
        } else {
          audio.pause();
          btn.textContent = 'Play';
        }
      }

      function updateProgress(audioId, progressId) {
        const audio = document.getElementById(audioId);
        const progress = document.getElementById(progressId);
        if (audio.duration) {
          const percentage = (audio.currentTime / audio.duration) * 100;
          progress.style.width = percentage + '%';
        }
      }

      function seek(event, audioId) {
        const audio = document.getElementById(audioId);
        const progressContainer = event.currentTarget;
        const clickX = event.clientX - progressContainer.getBoundingClientRect().left;
        const percentage = (clickX / progressContainer.offsetWidth) * 100;
        audio.currentTime = (percentage / 100) * audio.duration;
      }

      function playNext(currentTrackIndex) {
        const currentTrack = allTracks[currentTrackIndex];
        const currentButton = document.getElementById('btn' + currentTrackIndex);
        currentButton.textContent = 'Play';

        const nextTrackIndex = (currentTrackIndex + 1) % allTracks.length;
        const nextTrack = allTracks[nextTrackIndex];
        
        const nextAudio = document.getElementById(nextTrack.id);
        const nextButton = document.getElementById('btn' + nextTrackIndex);

        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach(audio => audio.pause());

        const allButtons = document.querySelectorAll('.play-btn');
        allButtons.forEach(b => {
          if (b.id !== nextButton.id) {
            b.textContent = 'Play';
          }
        });

        nextAudio.play();
        nextButton.textContent = 'Pause';
      }

      const mainContainer = document.getElementById('mainPlayer');
      tracks.forEach((track, index) => {
        mainContainer.appendChild(createPlayer(track, allTracks.findIndex(t => t.id === track.id)));
      });

      const instrumentalsContainer = document.getElementById('instrumentalsPlayer');
      instrumentalTracks.forEach((track, index) => {
        instrumentalsContainer.appendChild(createPlayer(track, allTracks.findIndex(t => t.id === track.id)));
      });

      const miniContainer = document.getElementById('miniPlayer');
      miniTracks.forEach((track, index) => {
        miniContainer.appendChild(createPlayer(track, allTracks.findIndex(t => t.id === track.id)));
      });