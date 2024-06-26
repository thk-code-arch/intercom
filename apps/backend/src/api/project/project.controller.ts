// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Controller,
  Res,
  Get,
  Post,
  Header,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { ProjectService } from './project.service';
import { UtilsService } from '../../utils/utils.service';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { ApiFile } from '../../auth/decorators/file.decorator';
import {
  AddNewProject,
  SelectProject,
  UpdateProject,
  SelectProjectFile,
} from './project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, IFCFileFilter } from '../../utils/file-upload';
import * as fs from 'fs';

import { createReadStream, Stats } from 'fs';

function isStats(value: true | Stats): value is Stats {
  return typeof value !== 'boolean';
}

@Auth(Roles.USER)
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly utils: UtilsService,
  ) {}
  private readonly logger = new Logger(ProjectController.name);

  @Post('select_project')
  selectProject(
    @CurrentUser('projects') project: number[],
    @Body() sP: SelectProject,
  ) {
    return this.projectService.select_project(project, sP.projectid);
  }

  @Auth(Roles.ADMIN)
  @Post('add_project')
  addProject(
    @CurrentUser('id') usrid: number,
    @Body() newProject: AddNewProject,
  ) {
    return this.projectService.newProject(usrid, newProject);
  }

  @Auth(Roles.ADMIN)
  @Post('edit_project')
  updateProject(@Body() editProject: UpdateProject) {
    return this.projectService.updateProject(editProject);
  }

  @Auth(Roles.ADMIN)
  @Post('delete_subproject')
  deleteProject(@Body() deleteProject: SelectProject) {
    return this.projectService.deleteSubProject(deleteProject);
  }

  @Get('get_projects')
  async getProjects(@CurrentUser('projectsDetails') projects) {
    return projects;
  }

  @Post('uploadifc/:projectid')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/files/input',
        filename: editFileName,
      }),
      fileFilter: IFCFileFilter,
    }),
  )
  async uploadIFCFile(
    @UploadedFile() file,
    @CurrentUser('id') usrid: number,
    @Param('projectid') projectid: number,
  ) {
    const upload = await this.projectService.uploadIFC(
      file.path,
      file.filename,
      usrid,
      projectid,
    );

    return {
      name: upload.filename,
      log: 'IFC fragment file uploaded successfully',
    };
  }

  @Get('get_projectfileifc/:projectId')
  @Header('Content-Type', 'application/octet-stream')
  @Header('Content-Disposition', 'attachment; filename="file.ifc"')
  async getProjectfileIfc(
    @Param() pid: SelectProjectFile,
    @CurrentUser('projects') project: number[],
    @Res() response,
  ) {
    try {
      const file = await this.projectService.getProjectfile(project, pid);
      const filePath = `/files/input/${file.filename}`;

      const fileExists = await fs.promises.stat(filePath).catch(() => false);
      if (fileExists) {
        if (isStats(fileExists)) {
          const fileStream = createReadStream(filePath);
          response.setHeader('Content-Length', fileExists.size);
          fileStream.pipe(response);
        } else {
          response.status(404).send('File not found');
        }
      } else {
        response.status(404).send('File not found');
      }
    } catch (err) {
      response.status(500).send('Internal Server Error');
    }
  }

  @Get('get_projectinfo/:theprojectId')
  getProjectinfo(@CurrentUser('projects') project: number[], @Param() p) {
    return this.projectService.getProjectinfo(project, p.theprojectId);
  }
}
