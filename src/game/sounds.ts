import kick from "../assets/kick.mp3";
import cheer from "../assets/cheer.mp3";
import boo from "../assets/boo.mp3";
import post from "../assets/post.mp3";

type Sound = HTMLAudioElement;

function makeSound(src: string): Sound {
  const audio = new Audio(src);
  audio.preload = "auto";
  return audio;
}

export const sounds: Record<
  "kick" | "cheer" | "boo" | "post",
  Sound
> = {
  kick: makeSound(kick),
  cheer: makeSound(cheer),
  boo: makeSound(boo),
  post: makeSound(post),
};