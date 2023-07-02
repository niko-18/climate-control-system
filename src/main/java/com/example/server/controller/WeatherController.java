package com.example.server.controller;

import com.example.server.entity.Log;
import com.example.server.entity.Range;
import com.example.server.repository.LogRepository;
import com.example.server.repository.RangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class WeatherController {

    private final RangeRepository rangeRepository;
    private final LogRepository logRepository;

    @Autowired
    public WeatherController(RangeRepository rangeRepository, LogRepository logRepository) {
        this.rangeRepository = rangeRepository;
        this.logRepository = logRepository;
    }

    @GetMapping("/range")
    public Range getRange() {
        List<Range> ranges = rangeRepository.findAll();
        if (ranges.size() == 0) return null;
        return ranges.get(0);
    }

    @GetMapping("/getData")
    public List<Log> getLogs() {
        return logRepository.findAll();
    }

    @PostMapping("/data")
    public void setData(@RequestBody Log log) {
        log.setDate(log.getDate() * 1000);
        logRepository.save(log);
    }

    @GetMapping("/filter")
    public List<Log> getByFilter(@RequestParam long date, @RequestParam long date2) {
        return logRepository.getLogByDate(date, date2);
    }

    @GetMapping("/getLast")
    public Log getByLast() {
        return logRepository.getLastLog();
    }

    @PostMapping("/updateRange")
    public void updateRange(@RequestBody Range range) {
        rangeRepository.deleteAll();
        rangeRepository.save(range);
    }

}
