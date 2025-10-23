# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "/home/mylinux/betterspades/_deps/cglm-src"
  "/home/mylinux/betterspades/_deps/cglm-build"
  "/home/mylinux/betterspades/_deps/cglm-subbuild/cglm-populate-prefix"
  "/home/mylinux/betterspades/_deps/cglm-subbuild/cglm-populate-prefix/tmp"
  "/home/mylinux/betterspades/_deps/cglm-subbuild/cglm-populate-prefix/src/cglm-populate-stamp"
  "/home/mylinux/betterspades/_deps/cglm-subbuild/cglm-populate-prefix/src"
  "/home/mylinux/betterspades/_deps/cglm-subbuild/cglm-populate-prefix/src/cglm-populate-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "/home/mylinux/betterspades/_deps/cglm-subbuild/cglm-populate-prefix/src/cglm-populate-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "/home/mylinux/betterspades/_deps/cglm-subbuild/cglm-populate-prefix/src/cglm-populate-stamp${cfgdir}") # cfgdir has leading slash
endif()
